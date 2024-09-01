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
  const [systemMessage, setSystemMessage] = useState('You are Arty, an AI assistant specialized in creating website elements, animations, and visual components. Your task is to generate the necessary code for any visual element requested, ensuring all elements are wrapped in appropriate HTML code blocks. This includes placing CSS in <style> tags, JavaScript in <script> tags, and ensuring the overall structure is encapsulated within <html>, <head>, and <body> tags as needed. If an animation or other functionality is requested, ensure that all required code is properly structured to allow for correct rendering and functionality.');
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
      const userMessage = { role: 'user', content: inputValue };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputValue('');
      setIsLoading(true);
      setError(null);

      const startTime = Date.now();
      let totalTokens = 0;

      try {
        const response = await fetch(`${process.env.REACT_APP_OLLAMA_API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            messages: [{ role: 'system', content: systemMessage }, ...messages, userMessage],
          }),
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API request failed with status ${response.status}`);
          } else {
            const errorText = await response.text();
            throw new Error(`API request failed: ${errorText}`);
          }
        }

        const detectContentType = (content) => {
          const trimmedContent = content.trim();
          if (trimmedContent.startsWith('<') && trimmedContent.endsWith('>')) {
            setCodeLanguage('html');
          } else {
            setCodeLanguage('javascript');
          }
        };

        const reader = response.body.getReader();
        let aiMessage = { role: 'assistant', content: '' };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.trim() === '') continue;
            const data = JSON.parse(line);
            
            if (!data.done) {
              aiMessage.content += data.message.content;
              totalTokens += data.message.content.split(' ').length; // Rough estimate
              setMessages(prevMessages => [...prevMessages.slice(0, -1), aiMessage]);
            } else {
              const endTime = Date.now();
              const duration = (endTime - startTime) / 1000; // in seconds
              setStats({
                tokensPerSecond: Math.round(totalTokens / duration),
                totalTokens: totalTokens
              });
              setPreviewContent(aiMessage.content);
              detectContentType(aiMessage.content);
            }
          }
        }
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
