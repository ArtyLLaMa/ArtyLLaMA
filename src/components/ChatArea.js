import React, { useRef, useEffect, useContext } from 'react';
import { Send, Lightbulb, Scroll, BookOpen, Coffee } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const ChatArea = ({
  messages,
  streamingMessage,
  error,
  inputValue,
  setInputValue,
  placeholderText,
  isLoading,
  handleSubmit,
}) => {
  const messagesEndRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const suggestions = [
    { icon: <Lightbulb size={20} />, text: 'Write a story in my favorite genre' },
    { icon: <Coffee size={20} />, text: 'Plan a relaxing day' },
    { icon: <Scroll size={20} />, text: 'Summarize a long document' },
    { icon: <BookOpen size={20} />, text: 'Study vocabulary' },
  ];

  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">
            {error}
          </div>
        )}
        {messages.length === 0 && !streamingMessage && (
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
          <MessageBubble key={index} message={message} theme={theme} />
        ))}
        {streamingMessage && (
          <MessageBubble
            message={streamingMessage}
            isStreaming={true}
            theme={theme}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholderText}
            className="flex-grow p-3 bg-transparent outline-none text-gray-800 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-800 dark:border-white border-t-transparent"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const MessageBubble = ({ message, isStreaming = false, theme }) => (
  <div
    className={`flex ${
      message.role === 'user' ? 'justify-end' : 'justify-start'
    }`}
  >
    <div
      className={`max-w-[75%] p-3 rounded-lg ${
        message.role === 'user'
          ? 'bg-blue-500 text-white'
          : isStreaming
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 animate-pulse'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      }`}
    >
      {message.content}
    </div>
  </div>
);

const SuggestionButton = ({ icon, text, setInputValue }) => (
  <button
    onClick={() => setInputValue(text)}
    className="flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-lg p-3 transition-colors w-full h-32"
  >
    <div className="mb-2">{icon}</div>
    <span className="text-xs text-center">{text}</span>
  </button>
);

export default ChatArea;
