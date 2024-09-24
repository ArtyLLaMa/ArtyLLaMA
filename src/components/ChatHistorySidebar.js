import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Star } from "lucide-react";

const ChatHistorySidebar = ({ isOpen, toggleSidebar, onSelectChat }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/chat/history", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Chat history response:", response.data); // For debugging
      setChatHistory(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/chat/search",
        { query: e.target.value, topK: 10 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Failed to search chat history:", error);
    }
  };

  const handleBookmarkToggle = async (chatId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/chat/bookmark",
        { chatId, bookmark: !currentStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchChatHistory();
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  };

  const chatsToDisplay =
    searchQuery.trim() === "" ? chatHistory : searchResults;

  const filteredChats = showBookmarks
    ? chatsToDisplay.filter((chat) => chat.bookmarked)
    : chatsToDisplay;

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-30 w-80 bg-white dark:bg-gray-800 shadow-lg`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Chat History
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 mb-4 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={showBookmarks}
            onChange={() => setShowBookmarks(!showBookmarks)}
            className="mr-2"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Show Bookmarked Only
          </label>
        </div>
        <div className="overflow-y-auto flex-grow">
          {filteredChats.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No chats found.
            </p>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="p-2 mb-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer flex justify-between items-center"
                onClick={() => onSelectChat(chat.sessionId)}
              >
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {chat.content.substring(0, 100)}...
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(chat.timestamp).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(chat.id, chat.bookmarked);
                  }}
                  className={`text-yellow-400 hover:text-yellow-500 ${
                    chat.bookmarked ? "" : "opacity-50"
                  }`}
                  title={chat.bookmarked ? "Remove Bookmark" : "Bookmark"}
                >
                  <Star size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistorySidebar;
