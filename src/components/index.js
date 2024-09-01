import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import PreviewPanel from './PreviewPanel';
import SettingsModal from './SettingsModal';
import ExpandedPreviewModal from './ExpandedPreviewModal';
import { useChat } from './useChat'; // We'll create this custom hook

const LLMChatInterface = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);

  const {
    messages,
    inputValue,
    setInputValue,
    placeholderText,
    previewContent,
    error,
    selectedModel,
    setSelectedModel,
    codeLanguage,
    isLoading,
    systemMessage,
    setSystemMessage,
    stats,
    handleSubmit,
  } = useChat();

  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);
  const toggleSettings = useCallback(() => setIsSettingsOpen(prev => !prev), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const toggleCodeView = useCallback(() => setShowCode(prev => !prev), []);
  const toggleArtifact = useCallback(() => setIsArtifactOpen(prev => !prev), []);

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
          handleSubmit={handleSubmit}
        />

        {isPreviewOpen && (
          <PreviewPanel
            showCode={showCode}
            toggleCodeView={toggleCodeView}
            toggleExpand={toggleExpand}
            codeLanguage={codeLanguage}
            previewContent={previewContent}
          />
        )}
      </div>

      {isExpanded && (
        <ExpandedPreviewModal
          toggleExpand={toggleExpand}
          showCode={showCode}
          codeLanguage={codeLanguage}
          previewContent={previewContent}
        />
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
    </div>
  );
};

export default LLMChatInterface;
