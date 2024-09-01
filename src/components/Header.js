import React from 'react';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';

const Header = ({ toggleSidebar, isSidebarOpen, selectedModel, stats, toggleSettings }) => (
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
);

export default Header;
