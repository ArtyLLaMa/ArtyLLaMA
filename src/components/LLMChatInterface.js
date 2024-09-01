import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Send, Code, Eye, Maximize2, X, Settings, ChevronLeft, ChevronRight, Download, Trash2, Save, Edit2 } from 'lucide-react';
import SandboxedHtmlPreview from './SandboxedHtmlPreview';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ModelManagement = ({ onModelSelect, selectedModel }) => {
  const [models, setModels] = useState([]);
  const [newModelName, setNewModelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pullProgress, setPullProgress] = useState(0);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_OLLAMA_API_URL}/api/tags`);
      if (!response.ok) throw new Error('Failed to fetch models');
      const data = await response.json();
      setModels(data.models);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pullModel = async () => {
    setLoading(true);
    setPullProgress(0);
    try {
      const response = await fetch(`${process.env.REACT_APP_OLLAMA_API_URL}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newModelName }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          const data = JSON.parse(line);
          if (data.total && data.completed) {
            setPullProgress(Math.round((data.completed / data.total) * 100));
          }
        }
      }

      await fetchModels();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setPullProgress(0);
    }
  };

  const deleteModel = async (modelName) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_OLLAMA_API_URL}/api/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName }),
      });
      if (!response.ok) throw new Error('Failed to delete model');
      await fetchModels();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Model Management</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newModelName}
          onChange={(e) => setNewModelName(e.target.value)}
          placeholder="Enter model name"
          className="mr-2 p-2 border rounded flex-grow bg-gray-700 text-white"
        />
        <button onClick={pullModel} className="bg-blue-500 text-white p-2 rounded flex items-center">
          <Download size={16} className="mr-2" /> Pull Model
        </button>
      </div>
      {loading && (
        <div className="mb-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pullProgress}%` }}></div>
          </div>
          <p className="text-white mt-2">Pulling model: {pullProgress}%</p>
        </div>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-2">
        {models.map((model) => (
          <li key={model.name} className="flex justify-between items-center bg-gray-700 p-2 rounded">
            <span className="text-white">{model.name}</span>
            <div>
              <button
                onClick={() => onModelSelect(model.name)}
                className={`${selectedModel === model.name ? 'bg-green-500' : 'bg-blue-500'} text-white p-1 rounded mr-2`}
              >
                {selectedModel === model.name ? 'Selected' : 'Select'}
              </button>
              <button
                onClick={() => deleteModel(model.name)}
                className="bg-red-500 text-white p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState('You are Arty, an AI assistant specialized in creating website elements, animations, and visual components. Your task is to generate the necessary code for any visual element requested, ensuring all elements are wrapped in appropriate HTML code blocks. This includes placing CSS in <style> tags, JavaScript in <script> tags, and ensuring the overall structure is encapsulated within <html>, <head>, and <body> tags as needed. If an animation or other functionality is requested, ensure that all required code is properly structured to allow for correct rendering and functionality.');
  const [isEditingSystemMessage, setIsEditingSystemMessage] = useState(false);
  const [stats, setStats] = useState({ tokensPerSecond: 0, totalTokens: 0 });
  const [showCode, setShowCode] = useState(false);
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
  }, [
    inputValue,
    messages,
    selectedModel,
    systemMessage,
    setMessages,
    setInputValue,
    setIsLoading,
    setError,
    setStats,
    setPreviewContent,
    setCodeLanguage
  ]);

  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);
  const toggleSettings = useCallback(() => setIsSettingsOpen(prev => !prev), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  //const togglePreview = useCallback(() => setIsPreviewOpen(prev => !prev), []);
  const toggleCodeView = useCallback(() => setShowCode(prev => !prev), []);

  const handleModelSelect = useCallback((modelName) => {
    setSelectedModel(modelName);
    setIsSettingsOpen(false);
  }, []);

  const handleSystemMessageSave = useCallback(() => {
    setIsEditingSystemMessage(false);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 font-sans">
      {/* Fixed Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          <h1 className="text-xl font-bold">ArtyLLaMa</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Model: {selectedModel}</span>
          <span className="text-sm">{stats.tokensPerSecond} tokens/s</span>
          <span className="text-sm">{stats.totalTokens} total tokens</span>
          <button onClick={toggleSettings} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 bg-gray-800 border-r border-gray-700 overflow-y-auto transition-all duration-300 ease-in-out`}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">System Message</h3>
              {isEditingSystemMessage ? (
                <div>
                  <textarea
                    value={systemMessage}
                    onChange={(e) => setSystemMessage(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                    rows="4"
                  />
                  <button onClick={handleSystemMessageSave} className="mt-2 bg-blue-500 text-white p-2 rounded flex items-center">
                    <Save size={16} className="mr-2" /> Save
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-2">{systemMessage}</p>
                  <button onClick={() => setIsEditingSystemMessage(true)} className="bg-gray-600 text-white p-1 rounded flex items-center">
                    <Edit2 size={16} className="mr-2" /> Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow flex flex-col overflow-hidden">
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
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex items-center bg-gray-700 rounded-full overflow-hidden">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholderText}
                className="flex-1 p-3 bg-transparent outline-none text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="p-3 text-blue-400 hover:text-blue-300 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        {isPreviewOpen && (
          <div className="w-1/3 flex-shrink-0 border-l border-gray-700 relative">
            <div className="absolute top-2 right-2 z-10 flex space-x-2">
              <button onClick={toggleCodeView} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                {showCode ? <Eye size={20} /> : <Code size={20} />}
              </button>
              <button onClick={toggleExpand} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <Maximize2 size={20} />
              </button>
            </div>
            {showCode ? (
              <SyntaxHighlighter language={codeLanguage} style={vscDarkPlus} className="h-full">
                {previewContent}
              </SyntaxHighlighter>
            ) : (
              <SandboxedHtmlPreview htmlContent={previewContent} />
            )}
          </div>
        )}
      </div>

      {/* Expanded Preview Modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 w-11/12 h-5/6 rounded-lg shadow-xl relative">
            <button onClick={toggleExpand} className="absolute top-2 right-2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <X size={20} />
            </button>
            {showCode ? (
              <SyntaxHighlighter language={codeLanguage} style={vscDarkPlus} className="h-full">
                {previewContent}
              </SyntaxHighlighter>
            ) : (
              <SandboxedHtmlPreview htmlContent={previewContent} />
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 w-96 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Current Model: {selectedModel}</label>
              <ModelManagement onModelSelect={handleModelSelect} selectedModel={selectedModel} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">System Message</label>
              <textarea
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                rows="4"
              />
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
