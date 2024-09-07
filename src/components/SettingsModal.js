import React, { useState, useEffect, useCallback } from 'react';
import { X, ExternalLink, Trash, Download, Info, Save, Plus } from 'lucide-react';
import axios from 'axios';

const OLLAMA_API_URL = 'http://localhost:11434';

const SettingsModal = ({ toggleSettings, selectedModel, setSelectedModel, systemMessage, setSystemMessage }) => {
  const [activeTab, setActiveTab] = useState('System Message');
  const [savedMessages, setSavedMessages] = useState([]);
  const [localModels, setLocalModels] = useState([]);
  const [newModelName, setNewModelName] = useState('');
  const [newMessageName, setNewMessageName] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [modelInfo, setModelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = ['System Message', 'Model Management', 'About'];

  const fetchUserPreferences = useCallback(async () => {
    try {
      const response = await axios.get('/api/user-preferences');
      const data = response.data;
      setSavedMessages(data.savedMessages || []);
      setSelectedModel(data.lastUsedModel || selectedModel);
      setSystemMessage(data.lastUsedSystemMessage || systemMessage);
    } catch (error) {
      console.error('Failed to fetch user preferences:', error);
    }
  }, [selectedModel, systemMessage, setSelectedModel, setSystemMessage]);
  
  useEffect(() => {
    fetchUserPreferences();
    fetchLocalModels();
  }, [fetchUserPreferences]);

  const fetchLocalModels = async () => {
    try {
      const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
      setLocalModels(response.data.models || []);
    } catch (error) {
      console.error('Failed to fetch local models:', error);
    }
  };

  const saveUserPreferences = async () => {
    try {
      await axios.post('/api/user-preferences', {
        savedMessages,
        lastUsedModel: selectedModel,
        lastUsedSystemMessage: systemMessage
      });
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  };

  const handleAddMessage = () => {
    if (newMessageName && newMessageContent) {
      const updatedMessages = [...savedMessages, { name: newMessageName, content: newMessageContent }];
      setSavedMessages(updatedMessages);
      saveUserPreferences();
      setNewMessageName('');
      setNewMessageContent('');
    }
  };

  const handleRemoveMessage = (index) => {
    const updatedMessages = savedMessages.filter((_, i) => i !== index);
    setSavedMessages(updatedMessages);
    saveUserPreferences();
  };

  const handleLoadMessage = (content) => {
    setSystemMessage(content);
    saveUserPreferences();
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
      await axios.delete(`${OLLAMA_API_URL}/api/delete`, { data: { name: modelName } });
      fetchLocalModels();
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  };

  const handleShowModelInfo = async (modelName) => {
    try {
      const response = await axios.post(`${OLLAMA_API_URL}/api/show`, { name: modelName });
      setModelInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch model info:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-[800px] rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={toggleSettings} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="flex h-[600px]">
          <div className="w-1/4 border-r border-gray-700 p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`w-full text-left p-2 rounded text-sm ${activeTab === tab ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="w-3/4 p-4 overflow-y-auto text-sm">
            {activeTab === 'System Message' && (
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">Current System Message</label>
                  <textarea
                    value={systemMessage}
                    onChange={(e) => setSystemMessage(e.target.value)}
                    className="w-full p-2 bg-gray-600 rounded text-xs"
                    rows="3"
                  />
                  <button
                    onClick={saveUserPreferences}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center"
                  >
                    <Save size={12} className="mr-1" /> Save Current
                  </button>
                </div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mb-2">Saved System Messages</h3>
                  {savedMessages.map((msg, index) => (
                    <div key={index} className="mb-2 flex justify-between items-center bg-gray-600 p-2 rounded">
                      <span className="text-xs">{msg.name}</span>
                      <div>
                        <button
                          onClick={() => handleLoadMessage(msg.content)}
                          className="text-blue-400 hover:text-blue-300 text-xs mr-2"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleRemoveMessage(index)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mb-2">Add New System Message</h3>
                  <input
                    type="text"
                    value={newMessageName}
                    onChange={(e) => setNewMessageName(e.target.value)}
                    placeholder="Message Name"
                    className="w-full p-2 bg-gray-600 rounded text-xs mb-2"
                  />
                  <textarea
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    placeholder="Message Content"
                    className="w-full p-2 bg-gray-600 rounded text-xs mb-2"
                    rows="3"
                  />
                  <button
                    onClick={handleAddMessage}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center"
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
                      className="flex-grow p-2 bg-gray-700 rounded-l text-white"
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
                    <div key={model.name} className="flex items-center justify-between bg-gray-700 p-2 rounded mb-2">
                      <span>{model.name}</span>
                      <div>
                        <button
                          onClick={() => handleShowModelInfo(model.name)}
                          className="text-blue-400 hover:text-blue-300 mr-2"
                        >
                          <Info size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteModel(model.name)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {modelInfo && (
                  <div className="mt-4 bg-gray-700 p-4 rounded">
                    <h4 className="font-medium mb-2">Model Information</h4>
                    <pre className="text-xs overflow-auto max-h-60">
                      {JSON.stringify(modelInfo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'About' && (
              <div className="bg-gray-700 p-3 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">About ArtyLLaMa</h3>
                <p className="text-xs text-gray-300 mb-3">
                  ArtyLLaMa is an AI-powered chat interface that allows users to interact with various language models and generate rich, interactive content.
                </p>
                <a
                  href="https://github.com/kroonen/artyllama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300 text-xs"
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
