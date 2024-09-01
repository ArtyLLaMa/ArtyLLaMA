import React from 'react';
import ModelManagement from './ModelManagement';

const SettingsModal = ({ toggleSettings, selectedModel, setSelectedModel, systemMessage, setSystemMessage }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 w-96 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Current Model: {selectedModel}</label>
        <ModelManagement onModelSelect={setSelectedModel} selectedModel={selectedModel} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">System Message</label>
        <textarea
          value={systemMessage}
          onChange={(e) => setSystemMessage(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white"
          rows="4"
        />
      </div>
      <button onClick={toggleSettings} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
        Close
      </button>
    </div>
  </div>
);

export default SettingsModal;
