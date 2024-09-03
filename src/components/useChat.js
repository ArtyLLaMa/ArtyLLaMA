import { useState, useEffect, useMemo, useCallback } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState(`You are an AI assistant specialized in creating rich, interactive content for web applications. When responding with special content types, use <antArtifact> tags to encapsulate them. The available artifact types are:

1. Code: Use for any programming language snippets.
2. Image: For SVG content or image URLs.
3. Chart: For creating data visualizations using Chart.js syntax.
4. Table: For structured data in table format.
5. Interactive: For content with JavaScript interactivity.
6. HTML: For general HTML content.

Format your artifacts like this:

<antArtifact identifier="unique-id" type="artifact-type" title="Descriptive Title">
{
  // For Chart artifacts, use this structure:
  "type": "bar", // or "line", "pie", etc.
  "data": {
    "labels": ["Label1", "Label2", "Label3"],
    "datasets": [{
      "label": "Dataset Label",
      "data": [value1, value2, value3],
      "backgroundColor": "rgba(75, 192, 192, 0.6)"
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Chart Title"
      }
    }
  }
}

For other artifact types, include the content directly within the tags. Always provide the content in a format that can be directly parsed and used by the application.
Always strive to provide the most relevant and interactive content possible, utilizing these artifact types to enhance the user experience. When appropriate, you may combine multiple artifacts in your responses to create comprehensive and engaging content.
Important: Do not include any JavaScript code or HTML tags outside of the artifact content itself. The artifact content should be directly usable by the application without additional processing.
</antArtifact>`);

  const [stats, setStats] = useState({ tokensPerSecond: 0, totalTokens: 0 });

  const placeholders = useMemo(() => [
    "What's on your mind?",
    "Ask me anything...",
    "How can I assist you today?",
    "What would you like to know?",
    "Let's explore a topic together"
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderText(placeholders[Math.floor(Math.random() * placeholders.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (!selectedModel) {
      setError('Please select a model before sending a message.');
      return;
    }

    const userMessage = { role: 'user', content: inputValue.trim(), timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();
    let totalTokens = 0;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'system', content: systemMessage }, ...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = { role: 'assistant', content: '', timestamp: new Date() };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5).trim();
            
            if (data === '[DONE]') continue;
            
            try {
              const parsedData = JSON.parse(data);
              if (parsedData.content) {
                aiMessage.content += parsedData.content;
                aiMessage.provider = parsedData.provider;
                
                setMessages(prevMessages => {
                  const updatedMessages = [...prevMessages];
                  const lastMessage = updatedMessages[updatedMessages.length - 1];
                  if (lastMessage.role === 'assistant') {
                    updatedMessages[updatedMessages.length - 1] = { ...aiMessage };
                  } else {
                    updatedMessages.push({ ...aiMessage });
                  }
                  return updatedMessages;
                });

                totalTokens += 1;
              }
              if (parsedData.fullContent) {
                totalTokens = parsedData.fullContent.split(' ').length;
              }
            } catch (parseError) {
              console.error('Error parsing JSON:', parseError);
            }
          }
        }
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      setStats({
        tokensPerSecond: Math.round(totalTokens / duration),
        totalTokens: totalTokens
      });

      return aiMessage;

    } catch (error) {
      console.error('Detailed error:', error);
      setError(`Failed to get a response from the AI. ${error.message}`);
      setMessages(prevMessages => [...prevMessages, { role: 'error', content: error.message, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, messages, selectedModel, systemMessage]);

  return {
    messages,
    inputValue,
    setInputValue,
    placeholderText,
    error,
    selectedModel,
    setSelectedModel,
    isLoading,
    systemMessage,
    setSystemMessage,
    stats,
    handleSubmit,
  };
};
