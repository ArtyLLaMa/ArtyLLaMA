import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Send, Code, Eye, Maximize2, X, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SandboxedHtmlPreview from './SandBoxedHtmlPreview';

const PreviewPanel = ({ isModal, previewContent, codeLanguage, toggleExpand }) => {
  const [showCode, setShowCode] = useState(false);

  const toggleCodeView = () => setShowCode(prev => !prev);

  return (
    <div className={`flex flex-col ${isModal ? 'h-full' : 'h-full'}`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{showCode ? 'Code' : 'Preview'}</h2>
        <div className="flex space-x-2">
          <button onClick={toggleCodeView} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
            {showCode ? <Eye size={20} /> : <Code size={20} />}
          </button>
          <button onClick={toggleExpand} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
            {isModal ? <X size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        {showCode ? (
          <SyntaxHighlighter language={codeLanguage} style={vscDarkPlus} className="h-full">
            {previewContent}
          </SyntaxHighlighter>
        ) : (
          <SandboxedHtmlPreview htmlContent={previewContent} />
        )}
      </div>
    </div>
  );
};

const LLMChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [previewContent, setPreviewContent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const messagesEndRef = useRef(null);

  const placeholders = useMemo(() => [
    "What's on your mind?",
    "Ask me anything...",
    "How can I assist you today?",
    "What would you like to know?",
    "Let's explore a topic together"
  ], []);

  const historyItems = useMemo(() => [
    "Chat session 1",
    "Chat session 2",
    "Chat session 3",
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderText(placeholders[Math.floor(Math.random() * placeholders.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchAvailableModels();
  }, []);

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      setAvailableModels(data.models);
      if (data.models.length > 0 && !selectedModel) {
        setSelectedModel(data.models[0].name);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setError('Failed to load available models. Please try again later.');
    }
  };

  const detectContentType = useCallback((content) => {
    const trimmedContent = content.trim();
    if (trimmedContent.startsWith('<') && trimmedContent.endsWith('>')) {
      setCodeLanguage('html');
    } else {
      setCodeLanguage('javascript');
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const userMessage = { role: 'user', content: inputValue };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputValue('');
      setIsLoading(true);
      setError(null);

      try {
        console.log("Sending request to Ollama...");
        const response = await fetch(`/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [...messages, userMessage],
          }),
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`API request failed with status ${response.status}`);
        }

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
              setMessages(prevMessages => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  return [...prevMessages.slice(0, -1), aiMessage];
                } else {
                  return [...prevMessages, aiMessage];
                }
              });
            } else {
              // Extract HTML artifact if present
              const htmlMatch = aiMessage.content.match(/<matrix_html>([\s\S]*?)<\/matrix_html>/);
              if (htmlMatch) {
                setPreviewContent(htmlMatch[1]);
                setCodeLanguage('html');
              } else {
                setPreviewContent(aiMessage.content);
                detectContentType(aiMessage.content);
              }
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
  }, [inputValue, messages, selectedModel, detectContentType]);

  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);
  const toggleSettings = useCallback(() => setIsSettingsOpen(prev => !prev), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const togglePreview = useCallback(() => setIsPreviewOpen(prev => !prev), []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 font-sans overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 z-10">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">ArtyLLaMa</h1>
          <div className="flex items-center space-x-4">
            <button onClick={toggleSettings} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <Settings size={20} />
            </button>
            <button onClick={togglePreview} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              {isPreviewOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-grow mt-16 overflow-hidden">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 bg-gray-800 border-r border-gray-700 overflow-y-auto transition-all duration-300 ease-in-out`}>
          <div className="p-4 flex-grow overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">History</h2>
            {historyItems.map((item, index) => (
              <div key={index} className="mb-2 text-sm hover:bg-gray-700 p-2 rounded cursor-pointer transition-colors">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-grow overflow-y-auto p-4">
            {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} max-w-[80%]`}>
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t border-gray-700">
            <div className="flex items-center bg-gray-700 rounded-full overflow-hidden">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholderText}
                className="flex-1 p-3 bg-transparent outline-none text-white"
                disabled={isLoading}
              />
              <button type="submit" className="p-3 text-blue-400 hover:text-blue-300 transition-colors" disabled={isLoading}>
                {isLoading ? 'Sending...' : <Send size={20} />}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        {isPreviewOpen && (
          <div className="w-1/3 flex-shrink-0 border-l border-gray-700">
            <PreviewPanel
              isModal={false}
              previewContent={previewContent}
              codeLanguage={codeLanguage}
              toggleExpand={toggleExpand}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 w-11/12 h-5/6 rounded-lg shadow-xl">
            <PreviewPanel
              isModal={true}
              previewContent={previewContent}
              codeLanguage={codeLanguage}
              toggleExpand={toggleExpand}
            />
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 w-96 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-gray-700 rounded p-2"
              >
                {availableModels.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={toggleSettings} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMChatInterface;
