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
import Sidebar from "./Sidebar";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);

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
    clearError,
  } = useChat(userPreferences, currentSessionId);

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

  const handleCreateSession = useCallback(async (submitAfterCreation = false) => {
    try {
      const response = await axiosInstance.post("/chat/sessions");
      const newSessionId = response.data.session.id;
      setCurrentSessionId(newSessionId);
      setMessages([]);
      // If submitAfterCreation is true, and there's input, call handleSubmit for the new session
      if (submitAfterCreation && inputValue.trim()) {
        // We need a dummy event object for handleSubmit
        const dummyEvent = { preventDefault: () => {} }; 
        await handleSubmit(dummyEvent, newSessionId);
      }
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  }, [setMessages, inputValue, handleSubmit]);

  const onMessageSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      // If there is no current session, create one first, then submit.
      if (!currentSessionId) {
        await handleCreateSession(true); // Pass a flag to indicate submission after creation
      } else {
        await handleSubmit(e, currentSessionId);
      }
    },
    [handleSubmit, currentSessionId, handleCreateSession]
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
      await axiosInstance.post("/user-preferences", updatedPreferences);
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

  const handleSelectSession = useCallback((sessionId) => {
    setCurrentSessionId(sessionId);
    setMessages([]);
  }, [setMessages]);

  const handleResultSelect = useCallback(
    (sessionId) => {
      handleSelectSession(sessionId);
    },
    [handleSelectSession]
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
      className={`flex flex-col h-screen`}
    >
      <Header {...headerProps} />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar
          isExpanded={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onSelectSession={handleSelectSession}
          onCreateSession={handleCreateSession}
          onResultSelect={handleResultSelect}
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          // Pass enableSemanticSearch to Sidebar so it can conditionally show/hide semantic search features
          enableSemanticSearch={userPreferences?.enableSemanticSearch}
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
              // Pass clearError to ChatArea to allow it to clear errors on input change.
              clearError={clearError}
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
