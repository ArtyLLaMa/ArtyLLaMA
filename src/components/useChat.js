import { useState, useEffect, useMemo, useCallback } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [previewContent, setPreviewContent] = useState(null);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState('You are an AI assistant specialized in creating website elements, animations, and visual components.');
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
    if (inputValue.trim()) {
      const userMessage = { role: 'user', content: inputValue, timestamp: new Date() };
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
          throw new Error(`API responded with ${response.status}`);
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
              
              if (data === '[DONE]') {
                continue; // Skip [DONE] messages
              }
              
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

                  setPreviewContent(aiMessage.content);
                  totalTokens += 1; // Increment token count (rough estimate)
                }
                if (parsedData.fullContent) {
                  // This is the final message
                  totalTokens = parsedData.fullContent.split(' ').length; // More accurate count
                }
              } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
              }
            }
          }
        }

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // in seconds
        setStats({
          tokensPerSecond: Math.round(totalTokens / duration),
          totalTokens: totalTokens
        });

      } catch (error) {
        console.error('Detailed error:', error);
        setError(`Failed to get a response from the AI. Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [inputValue, messages, selectedModel, systemMessage]);

  return {
    messages,
    inputValue,
    setInputValue,
    placeholderText,
    previewContent,
    error,
    selectedModel,
    setSelectedModel,
    codeLanguage,
    isLoading,
    systemMessage,
    setSystemMessage,
    stats,
    handleSubmit,
  };
};
