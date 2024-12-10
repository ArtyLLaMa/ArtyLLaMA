import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Search } from 'lucide-react';

const SemanticSearchBox = ({ onResultSelect, enableSemanticSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    try {
      const response = await axiosInstance.post('/chat/semantic-search', { query });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error performing semantic search:', error);
    }
  };

  if (!enableSemanticSearch) {
    return (
      <div className="semantic-search-box text-gray-400 text-sm italic">
        Semantic search is currently disabled.
      </div>
    );
  }

  return (
    <div className="semantic-search-box">
      <form onSubmit={handleSearch} className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Search chats..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-gray-800 rounded-md p-2 text-sm text-white"
        />
        <button type="submit" className="ml-2 text-gray-400 hover:text-white">
          <Search size={20} />
        </button>
      </form>
      {results.length > 0 && (
        <ul className="search-results bg-gray-800 rounded-md p-2 max-h-64 overflow-y-auto">
          {results.map((result) => (
            <li key={result.id} className="mb-2">
              <button
                onClick={() => onResultSelect(result.sessionId)}
                className="w-full text-left text-sm text-gray-300 hover:text-white"
              >
                {result.content.substring(0, 50)}...
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SemanticSearchBox;
