import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import { Sidebar as SidebarIcon } from "lucide-react";
import Header from "./Header";
import ChatArea from "./ChatArea";
import PreviewPanel from "./PreviewPanel";
import SettingsModal from "./SettingsModal";
import ExpandedPreviewModal from "./ExpandedPreviewModal";
import ChatHistorySidebar from "./ChatHistorySidebar";
import { useChat } from "./useChat";
import { parseArtifacts } from "../utils/artifactParser";
import { debounce } from "lodash";
import { ThemeContext } from "../context/ThemeContext";
import axiosInstance from "../utils/axiosInstance";

const LLMChatInterface = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [artifacts, setArtifacts] = useState([]);
  const [expandedArtifact, setExpandedArtifact] = useState(null);
  const [totalArtifacts, setTotalArtifacts] = useState(0);
  const [userPreferences, setUserPreferences] = useState(null);
  const userPreferencesFetchedRef = useRef(false);
  const { theme } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchUserPreferences = useCallback(async () => {
    if (userPreferencesFetchedRef.current) return;
    try {
      const response = await axiosInstance.get("/user-preferences");
      setUserPreferences(response.data);
      userPreferencesFetchedRef.current = true;
    } catch (error) {
      console.error("Failed to fetch user preferences:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserPreferences();
  }, [fetchUserPreferences]);

  const {
    messages,
    setMessages,
    streamingMessage,
    inputValue,
    setInputValue,
    placeholderText,
    error,
    selectedModel,
    setSelectedModel: setChatSelectedModel,
    isLoading,
    systemMessage,
    setSystemMessage: setChatSystemMessage,
    stats,
    handleSubmit,
  } = useChat(userPreferences);

  const processMessageForArtifacts = useCallback((message) => {
    if (message && message.role === "assistant") {
      const {
        artifacts: parsedArtifacts,
        totalArtifacts: messageTotalArtifacts,
      } = parseArtifacts(message.content);
      if (parsedArtifacts.length > 0) {
        setArtifacts((prevArtifacts) => [...prevArtifacts, ...parsedArtifacts]);
        setTotalArtifacts((prevTotal) => prevTotal + messageTotalArtifacts);
        setIsPreviewOpen(true);
      }
      return messageTotalArtifacts;
    }
    return 0;
  }, []);

  useEffect(() => {
    setArtifacts([]);
    setTotalArtifacts(0);
    messages.forEach(processMessageForArtifacts);
  }, [messages, processMessageForArtifacts]);

  useEffect(() => {
    if (streamingMessage) {
      processMessageForArtifacts(streamingMessage);
    }
  }, [streamingMessage, processMessageForArtifacts]);

  const onMessageSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await handleSubmit(e);
    },
    [handleSubmit]
  );

  const toggleSettings = useCallback(
    () => setIsSettingsOpen((prev) => !prev),
    []
  );
  const togglePreview = useCallback(
    () => setIsPreviewOpen((prev) => !prev),
    []
  );
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    []
  );

  const saveUserPreferences = async (updatedPreferences) => {
    try {
      await axios.post("/api/user-preferences", updatedPreferences);
    } catch (error) {
      console.error("Failed to save user preferences:", error);
    }
  };

  const debouncedSaveUserPreferences = useMemo(
    () => debounce(saveUserPreferences, 1000),
    []
  );

  const updateAndSaveUserPreferences = useCallback(
    (updatedPreferences) => {
      setUserPreferences((prev) => {
        const newPreferences = { ...prev, ...updatedPreferences };
        debouncedSaveUserPreferences(newPreferences);
        return newPreferences;
      });
    },
    [debouncedSaveUserPreferences]
  );

  const setSelectedModel = useCallback(
    (model) => {
      setChatSelectedModel(model);
      updateAndSaveUserPreferences({ lastUsedModel: model });
    },
    [setChatSelectedModel, updateAndSaveUserPreferences]
  );

  const setSystemMessage = useCallback(
    (message) => {
      setChatSystemMessage(message);
      updateAndSaveUserPreferences({ lastUsedSystemMessage: message });
    },
    [setChatSystemMessage, updateAndSaveUserPreferences]
  );

  const handleSelectChat = useCallback(
    async (sessionId) => {
      try {
        const response = await axios.get("/api/chat/history", {
          params: { sessionId },
          headers: {
            "Content-Type": "application/json",
          },
        });
        const messages = response.data.messages;
        setMessages(messages);
        setInputValue("");
        toggleSidebar();
      } catch (error) {
        console.error("Failed to load chat session:", error);
      }
    },
    [setMessages, setInputValue, toggleSidebar]
  );

  const headerProps = useMemo(
    () => ({
      selectedModel,
      setSelectedModel,
      stats,
      toggleSettings,
    }),
    [selectedModel, setSelectedModel, stats, toggleSettings]
  );

  return (
    <div
      className={`flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300`}
    >
      <Header {...headerProps} />
      <div className="flex-grow flex overflow-hidden">
        <ChatHistorySidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onSelectChat={handleSelectChat}
        />
        <div className="flex-grow flex flex-col">
          {!userPreferences ? (
            <div className="flex items-center justify-center flex-grow">
              Loading...
            </div>
          ) : (
            <ChatArea
              messages={messages}
              streamingMessage={streamingMessage}
              error={error}
              inputValue={inputValue}
              setInputValue={setInputValue}
              placeholderText={placeholderText}
              isLoading={isLoading}
              handleSubmit={onMessageSubmit}
            />
          )}
        </div>
        {isPreviewOpen && (
          <PreviewPanel
            artifacts={artifacts}
            closePreview={togglePreview}
            expandArtifact={setExpandedArtifact}
            totalArtifacts={totalArtifacts}
          />
        )}
      </div>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 bottom-4 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors z-10"
        >
          <SidebarIcon size={24} />
        </button>
      )}
      {!isPreviewOpen && artifacts.length > 0 && (
        <button
          onClick={togglePreview}
          className="fixed right-4 bottom-4 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors z-10"
        >
          <SidebarIcon size={24} />
        </button>
      )}
      {isSettingsOpen && (
        <SettingsModal
          toggleSettings={toggleSettings}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
          userPreferences={userPreferences}
          updateAndSaveUserPreferences={updateAndSaveUserPreferences}
        />
      )}
      {expandedArtifact && (
        <ExpandedPreviewModal
          artifact={expandedArtifact}
          toggleExpand={() => setExpandedArtifact(null)}
          totalArtifacts={totalArtifacts}
        />
      )}
    </div>
  );
};

export default LLMChatInterface;
