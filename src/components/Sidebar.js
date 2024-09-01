import React, { useState } from 'react';
import { Save, Edit2 } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, systemMessage, setSystemMessage }) => {
  const [isEditingSystemMessage, setIsEditingSystemMessage] = useState(false);

  const handleSystemMessageSave = () => {
    setIsEditingSystemMessage(false);
  };

  return (
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
  );
};

export default Sidebar;