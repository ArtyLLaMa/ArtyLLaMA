import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import LogoutButton from './LogoutButton'; // Import LogoutButton

const Header = React.memo(
  ({ selectedModel, setSelectedModel, stats, toggleSettings }) => {
    const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const modelsFetchedRef = useRef(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const modelSelectorRef = useRef(null); // Ref for the model selector dropdown

    const fetchModels = useCallback(async () => {
      if (modelsFetchedRef.current) return;
      setLoading(true);
      try {
        const response = await axios.get('/api/models');
        setModels(response.data.models);
        modelsFetchedRef.current = true;
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to fetch models');
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchModels();
    }, [fetchModels]);

    const toggleModelSelector = useCallback(() => {
      setIsModelSelectorOpen((prev) => !prev);
    }, []);

    const handleModelSelect = useCallback(
      (model) => {
        setSelectedModel(model);
        setIsModelSelectorOpen(false);
      },
      [setSelectedModel]
    );

    // Effect to handle clicks outside the model selector to close it
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target)) {
          setIsModelSelectorOpen(false);
        }
      };

      if (isModelSelectorOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isModelSelectorOpen]);

    return (
      <header className="bg-gray-100 text-gray-800 border-b border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 p-4 flex justify-between items-center relative">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-6">ArtyLLaMa</h1>
          <div className="relative" ref={modelSelectorRef}>
            <button
              onClick={toggleModelSelector}
              className="flex items-center space-x-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition-colors"
            >
              <span className="text-sm">{selectedModel}</span>
              <ChevronDown size={16} />
            </button>
            {isModelSelectorOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                {loading ? (
                  <p className="p-2 text-gray-700 dark:text-gray-200">Loading models...</p>
                ) : error ? (
                  <p className="p-2 text-red-500">{error}</p>
                ) : (
                  models.map((model) => (
                    <button
                      key={model.name}
                      onClick={() => handleModelSelect(model.name)}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold">{model.name}</div>
                        {model.description && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {model.description}
                          </div>
                        )}
                      </div>
                      {model.name === selectedModel && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {stats?.tokensPerSecond > 0 && (
            <span className="text-xs px-2 py-1 bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded">{stats.tokensPerSecond} t/s</span>
          )}
          {stats?.totalTokens > 0 && (
            <span className="text-xs px-2 py-1 bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded">{stats.totalTokens} tokens</span>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={toggleSettings}
            className="p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <LogoutButton />
        </div>
      </header>
    );
  }
);

export default Header;
