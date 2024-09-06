import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Plus, Trash, Save } from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ systemMessage, setSystemMessage, selectedModel, setSelectedModel }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingSystemMessage, setIsEditingSystemMessage] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);
  const [newMessageName, setNewMessageName] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');

  const loadUserPreferences = useCallback(async () => {
    try {
      const response = await axios.get('/api/user-preferences');
      setSavedMessages(response.data.savedMessages || []);
      setSelectedModel(prevModel => response.data.lastUsedModel || prevModel);
      setSystemMessage(prevMessage => response.data.lastUsedSystemMessage || prevMessage);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }, [setSelectedModel, setSystemMessage]);

  useEffect(() => {
    loadUserPreferences();
  }, [loadUserPreferences]);

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

  const handleSystemMessageSave = () => {
    setIsEditingSystemMessage(false);
    saveUserPreferences();
  };

  const handleAddMessage = () => {
    if (newMessageName && newMessageContent) {
      setSavedMessages([...savedMessages, { name: newMessageName, content: newMessageContent }]);
      setNewMessageName('');
      setNewMessageContent('');
      saveUserPreferences();
    }
  };

  const handleRemoveMessage = (index) => {
    const updatedMessages = savedMessages.filter((_, i) => i !== index);
    setSavedMessages(updatedMessages);
    saveUserPreferences();
  };

  const handleUseMessage = (content) => {
    setSystemMessage(content);
    saveUserPreferences();
  };

  const truncateMessage = (message, maxLength = 100) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  return (
    <div className={`h-full bg-gray-900 text-white flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-12'}`}>
      <div className="p-2 flex justify-between items-center border-b border-gray-700">
        <h1 className={`text-xl font-bold ${isExpanded ? '' : 'hidden'}`}>ArtyLLaMa</h1>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-gray-700"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      {isExpanded && (
        <>
          <div className="flex-grow overflow-y-auto p-4">
            <h2 className="text-sm font-semibold mb-2">Current System Message</h2>
            {isEditingSystemMessage ? (
              <div>
                <textarea
                  value={systemMessage}
                  onChange={(e) => setSystemMessage(e.target.value)}
                  className="w-full bg-gray-800 rounded-md resize-none p-2 text-sm"
                  rows={3}
                />
                <button
                  onClick={handleSystemMessageSave}
                  className="mt-2 bg-blue-500 px-2 py-1 rounded-md text-sm hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-2 whitespace-pre-line">
                  {truncateMessage(systemMessage)}
                </p>
                <button
                  onClick={() => setIsEditingSystemMessage(true)}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                >
                  <Edit2 className="mr-1" size={14} /> Edit
                </button>
              </div>
            )}

            <h2 className="text-sm font-semibold mt-4 mb-2">Saved System Messages</h2>
            {savedMessages.map((msg, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-800 rounded">
                <h3 className="text-sm font-medium">{msg.name}</h3>
                <p className="text-xs text-gray-400">{truncateMessage(msg.content, 50)}</p>
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => handleUseMessage(msg.content)}
                    className="text-xs text-blue-400 hover:text-blue-300 mr-2"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => handleRemoveMessage(index)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              </div>
            ))}

            <h2 className="text-sm font-semibold mt-4 mb-2">Add New System Message</h2>
            <input
              type="text"
              value={newMessageName}
              onChange={(e) => setNewMessageName(e.target.value)}
              placeholder="Message Name"
              className="w-full bg-gray-800 rounded-md p-2 text-sm mb-2"
            />
            <textarea
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              placeholder="Message Content"
              className="w-full bg-gray-800 rounded-md resize-none p-2 text-sm mb-2"
              rows={3}
            />
            <button
              onClick={handleAddMessage}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center hover:bg-green-600"
            >
              <Plus size={14} className="mr-1" /> Add Message
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
