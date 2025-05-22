import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import {
  X,
  ExternalLink,
  Trash,
  Download,
  Info,
  Save,
  Plus,
  Key,
} from 'lucide-react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

const OLLAMA_API_URL = 'http://localhost:11434';

const SettingsModal = ({
  toggleSettings,
  selectedModel,
  setSelectedModel,
  systemMessage,
  setSystemMessage,
  updateAndSaveUserPreferences,
}) => {
  const [activeTab, setActiveTab] = useState('System Message');
  const [savedMessages, setSavedMessages] = useState([]);
  const [localModels, setLocalModels] = useState([]);
  const [newModelName, setNewModelName] = useState('');
  const [newMessageName, setNewMessageName] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [modelInfo, setModelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    OLLAMA_API_URL: '',
    ANTHROPIC_API_KEY: '',
    OPENAI_API_KEY: '',
  });
  const [embeddingModel, setEmbeddingModel] = useState('OpenAI');
  const [enableSemanticSearch, setEnableSemanticSearch] = useState(true); // New state for semantic search toggle
  const [autoGenerateChatTitle, setAutoGenerateChatTitle] = useState(true); // New state for auto title generation

  const tabs = ['System Message', 'Model Management', 'API Keys', 'Embedding Settings', 'Chat Settings', 'About'];

  const [localSystemMessage, setLocalSystemMessage] = useState(systemMessage);
  const initialRenderRef = useRef(true);
  const { theme } = useContext(ThemeContext);

  const fetchUserPreferences = useCallback(async () => {
    if (initialRenderRef.current) {
      try {
        const response = await axios.get('/api/user-preferences');
        const data = response.data;
        setSavedMessages(data.savedMessages || []);
        setApiKeys(data.apiKeys || {});
        setEmbeddingModel(data.embeddingModel || 'OpenAI');
        setEnableSemanticSearch(data.enableSemanticSearch !== false); // Load semantic search preference
        setAutoGenerateChatTitle(data.autoGenerateChatTitle !== false); // Load auto title generation preference
        if (data.lastUsedModel && data.lastUsedModel !== selectedModel) {
          setSelectedModel(data.lastUsedModel);
        }
        if (
          data.lastUsedSystemMessage &&
          data.lastUsedSystemMessage !== systemMessage
        ) {
          setLocalSystemMessage(data.lastUsedSystemMessage);
        }
      } catch (error) {
        console.error('Failed to fetch user preferences:', error);
      }
      initialRenderRef.current = false;
    }
  }, [selectedModel, systemMessage, setSelectedModel]);

  useEffect(() => {
    fetchUserPreferences();
    fetchLocalModels();
  }, [fetchUserPreferences]);

  const handleLoadMessage = (content) => {
    setLocalSystemMessage(content);
  };

  const handleSaveSystemMessage = () => {
    setSystemMessage(localSystemMessage);
    updateAndSaveUserPreferences({
      lastUsedSystemMessage: localSystemMessage,
      savedMessages,
      apiKeys,
      embeddingModel,
      enableSemanticSearch,
      autoGenerateChatTitle,
    });
  };

  const fetchLocalModels = async () => {
    try {
      const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
      setLocalModels(response.data.models || []);
    } catch (error) {
      console.error('Failed to fetch local models:', error);
    }
  };

  const handleAddMessage = () => {
    if (newMessageName && newMessageContent) {
      const updatedMessages = [
        ...savedMessages,
        { name: newMessageName, content: newMessageContent },
      ];
      setSavedMessages(updatedMessages);
      updateAndSaveUserPreferences({
        savedMessages: updatedMessages,
        embeddingModel,
        enableSemanticSearch,
        autoGenerateChatTitle,
      });
      setNewMessageName('');
      setNewMessageContent('');
    }
  };

  const handleRemoveMessage = (index) => {
    const updatedMessages = savedMessages.filter((_, i) => i !== index);
    setSavedMessages(updatedMessages);
    updateAndSaveUserPreferences({
      savedMessages: updatedMessages,
      embeddingModel,
      enableSemanticSearch,
      autoGenerateChatTitle,
    });
  };

  const handlePullModel = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${OLLAMA_API_URL}/api/pull`, { name: newModelName });
      fetchLocalModels();
      setNewModelName('');
    } catch (error) {
      console.error('Failed to pull model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModel = async (modelName) => {
    try {
      await axios.delete(`${OLLAMA_API_URL}/api/delete`, {
        data: { name: modelName },
      });
      fetchLocalModels();
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  };

  const handleShowModelInfo = async (modelName) => {
    try {
      const response = await axios.post(`${OLLAMA_API_URL}/api/show`, {
        name: modelName,
      });
      setModelInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch model info:', error);
    }
  };

  const handleApiKeyChange = (e) => {
    setApiKeys((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveApiKeys = () => {
    updateAndSaveUserPreferences({ apiKeys, embeddingModel, enableSemanticSearch, autoGenerateChatTitle });
    alert('API keys saved successfully');
  };

  const handleEmbeddingModelChange = (e) => {
    setEmbeddingModel(e.target.value);
    updateAndSaveUserPreferences({ embeddingModel: e.target.value, enableSemanticSearch, autoGenerateChatTitle });
  };

  const handleSemanticSearchToggle = (e) => {
    setEnableSemanticSearch(e.target.checked);
    updateAndSaveUserPreferences({ enableSemanticSearch: e.target.checked, embeddingModel, autoGenerateChatTitle });
  };

  const handleAutoGenerateChatTitleToggle = (e) => {
    setAutoGenerateChatTitle(e.target.checked);
    updateAndSaveUserPreferences({ autoGenerateChatTitle: e.target.checked, embeddingModel, enableSemanticSearch });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={toggleSettings}
    >
      <div
        className="bg-white dark:bg-gray-800 w-[800px] rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={toggleSettings}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex h-[600px]">
          <div className="w-1/4 border-r border-gray-200 dark:border-gray-700 p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`w-full text-left p-2 rounded text-sm ${
                  activeTab === tab
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="w-3/4 p-4 overflow-y-auto text-sm">
            {activeTab === 'System Message' && (
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    Current System Message
                  </label>
                  <textarea
                    value={localSystemMessage}
                    onChange={(e) => setLocalSystemMessage(e.target.value)}
                    className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-800 dark:text-white"
                    rows="3"
                  />
                  <button
                    onClick={handleSaveSystemMessage}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center hover:bg-blue-600 transition-colors"
                  >
                    <Save size={12} className="mr-1" /> Save Current
                  </button>
                </div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mb-2">
                    Saved System Messages
                  </h3>
                  {savedMessages.map((msg, index) => (
                    <div
                      key={index}
                      className="mb-2 flex justify-between items-center bg-gray-200 dark:bg-gray-600 p-2 rounded"
                    >
                      <span className="text-xs">{msg.name}</span>
                      <div>
                        <button
                          onClick={() => handleLoadMessage(msg.content)}
                          className="text-blue-500 hover:text-blue-600 text-xs mr-2"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleRemoveMessage(index)}
                          className="text-red-500 hover:text-red-600 text-xs"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mb-2">
                    Add New System Message
                  </h3>
                  <input
                    type="text"
                    value={newMessageName}
                    onChange={(e) => setNewMessageName(e.target.value)}
                    placeholder="Message Name"
                    className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-800 dark:text-white mb-2"
                  />
                  <textarea
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    placeholder="Message Content"
                    className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-800 dark:text-white mb-2"
                    rows="3"
                  />
                  <button
                    onClick={handleAddMessage}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center hover:bg-green-600 transition-colors"
                  >
                    <Plus size={12} className="mr-1" /> Add Message
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'Model Management' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Model Management</h3>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Pull New Model</h4>
                  <div className="flex">
                    <input
                      type="text"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      placeholder="Enter model name"
                      className="flex-grow p-2 bg-gray-200 dark:bg-gray-700 rounded-l text-gray-800 dark:text-white"
                    />
                    <button
                      onClick={handlePullModel}
                      disabled={isLoading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
                    >
                      {isLoading ? 'Pulling...' : <Download size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Local Models</h4>
                  {localModels.map((model) => (
                    <div
                      key={model.name}
                      className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded mb-2"
                    >
                      <span>{model.name}</span>
                      <div>
                        <button
                          onClick={() => handleShowModelInfo(model.name)}
                          className="text-blue-500 hover:text-blue-600 mr-2"
                        >
                          <Info size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteModel(model.name)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {modelInfo && (
                  <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Model Information</h4>
                    <pre className="text-xs overflow-auto max-h-60">
                      {JSON.stringify(modelInfo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'API Keys' && (
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">API Key Management</h3>
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    Ollama API URL:
                  </label>
                  <input
                    type="text"
                    name="OLLAMA_API_URL"
                    value={apiKeys.OLLAMA_API_URL}
                    onChange={handleApiKeyChange}
                    className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-800 dark:text-white"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    Anthropic API Key:
                  </label>
                  <input
                    type="password"
                    name="ANTHROPIC_API_KEY"
                    value={apiKeys.ANTHROPIC_API_KEY}
                    onChange={handleApiKeyChange}
                    className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-800 dark:text-white"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    OpenAI API Key:
                  </label>
                  <input
                    type="password"
                    name="OPENAI_API_KEY"
                    value={apiKeys.OPENAI_API_KEY}
                    onChange={handleApiKeyChange}
                    className="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-800 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleSaveApiKeys}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center hover:bg-blue-600 transition-colors"
                >
                  <Key size={12} className="mr-1" /> Save API Keys
                </button>
              </div>
            )}
            {activeTab === 'Embedding Settings' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Embedding Settings</h3>
                {/* Embedding Model Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Embedding Model
                  </label>
                  <select
                    value={embeddingModel}
                    onChange={handleEmbeddingModelChange}
                    className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-white"
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Ollama">Ollama</option>
                    {/* Add other models as needed */}
                  </select>
                </div>
                {/* Semantic Search Toggle */}
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="semanticSearchToggle"
                    checked={enableSemanticSearch}
                    onChange={handleSemanticSearchToggle}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="semanticSearchToggle" className="text-sm font-medium">
                    Enable Semantic Search
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Semantic search helps find relevant documents based on meaning, not just keywords. Requires a compatible embedding model.
                </p>
              </div>
            )}
            {activeTab === 'Chat Settings' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Chat Settings</h3>
                {/* Auto Generate Chat Title Toggle */}
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="autoGenerateChatTitleToggle"
                    checked={autoGenerateChatTitle}
                    onChange={handleAutoGenerateChatTitleToggle}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="autoGenerateChatTitleToggle" className="text-sm font-medium">
                    Automatically Generate Chat Titles
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  If enabled, chat titles will be automatically generated based on the first AI response.
                </p>
              </div>
            )}
            {activeTab === 'About' && (
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">About ArtyLLaMa</h3>
                <p className="text-xs text-gray-800 dark:text-gray-300 mb-3">
                  ArtyLLaMa is an AI-powered chat interface that allows users to
                  interact with various language models and generate rich,
                  interactive content.
                </p>
                <a
                  href="https://github.com/kroonen/artyllama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 hover:text-blue-600 text-xs"
                >
                  <ExternalLink size={12} className="mr-1" />
                  View on GitHub
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
