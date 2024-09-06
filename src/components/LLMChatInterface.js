import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar as SidebarIcon } from 'lucide-react';
import Header from './Header';
import ChatArea from './ChatArea';
import PreviewPanel from './PreviewPanel';
import SettingsModal from './SettingsModal';
import ExpandedPreviewModal from './ExpandedPreviewModal';
import { useChat } from './useChat';
import { parseArtifacts } from '../utils/artifactParser';

const LLMChatInterface = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [artifacts, setArtifacts] = useState([]);
  const [expandedArtifact, setExpandedArtifact] = useState(null);

  const {
    messages,
    streamingMessage,
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
    if (message && message.role === 'assistant') {
      const parsedArtifacts = parseArtifacts(message.content);
      if (parsedArtifacts.length > 0) {
        setArtifacts(prevArtifacts => [...prevArtifacts, ...parsedArtifacts]);
        setIsPreviewOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    messages.forEach(processMessageForArtifacts);
  }, [messages, processMessageForArtifacts]);

  useEffect(() => {
    if (streamingMessage) {
      processMessageForArtifacts(streamingMessage);
    }
  }, [streamingMessage, processMessageForArtifacts]);

  const onMessageSubmit = useCallback(async (e) => {
    e.preventDefault();
    await handleSubmit(e);
  }, [handleSubmit]);

  const toggleSettings = useCallback(() => setIsSettingsOpen(prev => !prev), []);
  const togglePreview = useCallback(() => setIsPreviewOpen(prev => !prev), []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300">
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        stats={stats}
        toggleSettings={toggleSettings}
      />
      <div className="flex-grow flex overflow-hidden">
        <div className="flex-grow flex flex-col">
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
        </div>
        {isPreviewOpen && (
          <PreviewPanel
            artifacts={artifacts}
            closePreview={togglePreview}
            expandArtifact={setExpandedArtifact}
          />
        )}
      </div>
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
        />
      )}
      {expandedArtifact && (
        <ExpandedPreviewModal
          artifact={expandedArtifact}
          toggleExpand={() => setExpandedArtifact(null)}
        />
      )}
    </div>
  );
};

export default LLMChatInterface;
