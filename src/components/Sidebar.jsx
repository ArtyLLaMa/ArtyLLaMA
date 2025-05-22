import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import SessionList from './SessionList';
import SemanticSearchBox from './SemanticSearchBox';

const Sidebar = ({ 
  onSelectSession, 
  onCreateSession, 
  onResultSelect, 
  enableSemanticSearch
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 flex-shrink-0 ${
        isExpanded ? 'w-64' : 'w-12'
      } bg-white text-black dark:bg-gray-900 dark:text-white`}
    >
      <div className="p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className={`text-xl font-bold ${isExpanded ? '' : 'hidden'}`}>History</div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      {isExpanded && (
        <div className="flex-grow overflow-y-auto p-4 flex flex-col">
          {/* Pass enableSemanticSearch down to SemanticSearchBox */}
          <SemanticSearchBox onResultSelect={onResultSelect} enableSemanticSearch={enableSemanticSearch} />

          {/* Session Management */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Chats</h2>
              <button
                onClick={onCreateSession}
                className="text-green-500 hover:text-green-400 flex items-center"
              >
                <Plus size={16} className="mr-1" /> New Chat
              </button>
            </div>
            <SessionList onSelectSession={onSelectSession} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
