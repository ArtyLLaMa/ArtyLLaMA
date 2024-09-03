import React, { useState, useCallback } from 'react';
import { Sidebar as SidebarIcon } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import PreviewPanel from './PreviewPanel';
import SettingsModal from './SettingsModal';
import { useChat } from './useChat';
import { parseArtifacts } from '../utils/artifactParser';

const LLMChatInterface = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [artifacts, setArtifacts] = useState([]);

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
        setArtifacts(parsedArtifacts);
        setIsPreviewOpen(true);
      }
    }
  }, []);

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

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 font-sans">
      <Header
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        selectedModel={selectedModel}
        stats={stats}
        toggleSettings={toggleSettings}
      />

      <div className="flex flex-grow overflow-hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
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
          />
        )}

        {!isPreviewOpen && artifacts.length > 0 && (
          <button
            onClick={togglePreview}
            className="absolute right-4 bottom-4 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
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
    </div>
  );
};

export default LLMChatInterface;
