import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, Atom, ChartBarBig, Gamepad2, ChartSpline } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import suggestionsData from '../config/suggestions.json';

// iconMap maps icon names from suggestions.json to their corresponding Lucide React components.
const iconMap = {
  ChartSpline: <ChartSpline size={20} />,
  Gamepad2: <Gamepad2 size={20} />,
  ChartBarBig: <ChartBarBig size={20} />,
  Atom: <Atom size={20} />,
};

const ChatArea = ({
  messages,
  streamingMessage,
  error,
  inputValue,
  setInputValue,
  placeholderText,
  isLoading,
  handleSubmit,
  clearError,
}) => {
  const messagesEndRef = useRef(null);
  const { theme } = useContext(ThemeContext); // Ensure theme is used, or default to dark
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  useEffect(() => {
    const loadedSuggestions = suggestionsData.map(suggestion => ({
      ...suggestion,
      icon: iconMap[suggestion.iconName] || <Atom size={20} />
    }));
    setSuggestions(loadedSuggestions);
  }, []);

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-200 text-red-800 dark:bg-red-700 dark:text-white p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        {messages.length === 0 && !streamingMessage && !error && (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {suggestions.map((suggestion, index) => (
                <SuggestionButton
                  key={index}
                  icon={suggestion.icon}
                  text={suggestion.text}
                  setInputValue={setInputValue}
                />
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {streamingMessage && (
          <MessageBubble
            message={streamingMessage}
            isStreaming={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error && clearError) {
                clearError();
              }
            }}
            placeholder={placeholderText || "Send a message..."}
            className="flex-grow p-3 bg-transparent outline-none text-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-transparent"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const MessageBubble = ({ message, isStreaming = false }) => (
  <div
    className={`flex ${
      message.role === 'user' ? 'justify-end' : 'justify-start'
    }`}
  >
    <div
      className={`max-w-[75%] p-3 rounded-lg text-sm ${
        message.role === 'user'
          ? 'bg-blue-600 text-white'
          : isStreaming
          ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 animate-pulse'
          : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }`}
    >
      {message.content}
    </div>
  </div>
);

const SuggestionButton = ({ icon, text, setInputValue }) => (
  <button
    onClick={() => setInputValue(text)}
    className="flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg p-4 transition-colors w-full h-36"
  >
    <div className="mb-2">{icon}</div>
    <span className="text-xs text-center">{text}</span>
  </button>
);

export default ChatArea;
