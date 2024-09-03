import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar as SidebarIcon } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import PreviewPanel from './PreviewPanel';
import SettingsModal from './SettingsModal';
import ExpandedPreviewModal from './ExpandedPreviewModal';
import { useChat } from './useChat';
import { parseArtifacts } from '../utils/artifactParser';

const LLMChatInterface = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [artifacts, setArtifacts] = useState([]);
  const [expandedArtifact, setExpandedArtifact] = useState(null);

  const {
    messages,
    inputValue,
    setInputValue,
    placeholderText,
    error,
    selectedModel,
    setSelectedModel,
    isLoading,
    systemMessage,
    setSystemMessage,
    stats,
    handleSubmit,
  } = useChat();

  const processMessageForArtifacts = useCallback((message) => {
    if (message.role === 'assistant') {
      const parsedArtifacts = parseArtifacts(message.content);
      if (parsedArtifacts.length > 0) {
        setArtifacts(prevArtifacts => [...prevArtifacts, ...parsedArtifacts]);
        setIsPreviewOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    // Process initial messages for artifacts
    messages.forEach(processMessageForArtifacts);
  }, []); // Empty dependency array ensures this runs only once on mount

  const onMessageSubmit = useCallback(async (e) => {
    e.preventDefault();
    const response = await handleSubmit(e);
    if (response) {
      processMessageForArtifacts(response);
    }
  }, [handleSubmit, processMessageForArtifacts]);

  const toggleSettings = useCallback(() => setIsSettingsOpen(prev => !prev), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const togglePreview = useCallback(() => setIsPreviewOpen(prev => !prev), []);
  
  const expandArtifact = useCallback((artifact) => {
    setExpandedArtifact(artifact);
  }, []);

  const closeExpandedArtifact = useCallback(() => {
    setExpandedArtifact(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 font-sans">
      <Header
        selectedModel={selectedModel}
        stats={stats}
        toggleSettings={toggleSettings}
      />

      <div className="flex flex-grow overflow-hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
          toggleSidebar={toggleSidebar}
        />

        <ChatArea
          messages={messages}
          error={error}
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholderText={placeholderText}
          isLoading={isLoading}
          handleSubmit={onMessageSubmit}
        />

        {isPreviewOpen && artifacts.length > 0 && (
          <PreviewPanel
            artifacts={artifacts}
            closePreview={togglePreview}
            expandArtifact={expandArtifact}
          />
        )}

        {!isPreviewOpen && artifacts.length > 0 && (
          <button
            onClick={togglePreview}
            className="fixed right-4 bottom-4 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors z-10"
            title="Open Preview Panel"
          >
            <SidebarIcon size={24} />
          </button>
        )}
      </div>

      {isSettingsOpen && (
        <SettingsModal
          toggleSettings={toggleSettings}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
        />
      )}

      {expandedArtifact && (
        <ExpandedPreviewModal
          artifact={expandedArtifact}
          toggleExpand={closeExpandedArtifact}
        />
      )}
    </div>
  );
};

export default LLMChatInterface;
