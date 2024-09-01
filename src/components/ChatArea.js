import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatArea = ({ messages, error, inputValue, setInputValue, placeholderText, isLoading, handleSubmit }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4">
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} max-w-[80%]`}>
            {message.content}
            <div className="text-xs text-gray-400 mt-1">
              {formatTimestamp(message.timestamp)}
              {message.provider && ` • ${message.provider}`}
            </div>
          </div>
        </div>        
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholderText}
            className="flex-1 p-3 bg-transparent outline-none text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 text-blue-400 hover:text-blue-300 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;
