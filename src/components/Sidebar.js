import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import SessionList from './SessionList';
import SemanticSearchBox from './SemanticSearchBox';

const Sidebar = ({ onSelectSession, onCreateSession, onResultSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

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
            {/* Semantic Search Box */}
            <SemanticSearchBox onResultSelect={onResultSelect} />

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
        </>
      )}
    </div>
  );
};

export default Sidebar;
