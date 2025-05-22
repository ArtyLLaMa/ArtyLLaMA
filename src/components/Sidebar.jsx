import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import SessionList from './SessionList';
import SemanticSearchBox from './SemanticSearchBox';

const Sidebar = ({ 
  onSelectSession, 
  onCreateSession, 
  onResultSelect, 
  enableSemanticSearch,
  isExpanded,
  setIsExpanded
}) => {
  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 flex-shrink-0 relative ${
        isExpanded ? 'w-64' : 'w-16'
      } bg-white text-black dark:bg-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700`}
    >
      <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className={`text-lg font-semibold ${isExpanded ? '' : 'hidden'}`}>Chat History</div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className={`flex-grow overflow-y-auto overflow-x-hidden p-3 ${isExpanded ? '' : 'flex flex-col items-center'}`}>
        {isExpanded ? (
          <>
            {/* Pass enableSemanticSearch down to SemanticSearchBox */}
            <SemanticSearchBox onResultSelect={onResultSelect} enableSemanticSearch={enableSemanticSearch} />

            {/* Session Management */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Sessions</h2>
                <button
                  onClick={onCreateSession}
                  title="New Chat"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Plus size={18} />
                  <span className="ml-1 text-sm">New</span>
                </button>
              </div>
              <SessionList onSelectSession={onSelectSession} />
            </div>
          </>
        ) : (
          <>
            <button
              onClick={onCreateSession}
              title="New Chat"
              className="mt-3 p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
            >
              <Plus size={24} />
            </button>
            {/* Add other icons for collapsed state if needed */}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
