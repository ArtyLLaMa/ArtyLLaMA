import React, { useState, useEffect, useRef } from 'react';
import { Code, Eye, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SandboxedHtmlPreview from './SandboxedHtmlPreview';

const PreviewPanel = ({ artifacts, closePreview }) => {
  const [currentArtifact, setCurrentArtifact] = useState(0);
  const [isCodeView, setIsCodeView] = useState(false);
  const [selectedTab, setSelectedTab] = useState('html');
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = artifacts[currentArtifact].html;
    }
  }, [currentArtifact, artifacts]);

  const toggleCodeView = () => setIsCodeView(!isCodeView);
  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const nextArtifact = () => setCurrentArtifact((prev) => (prev + 1) % artifacts.length);
  const prevArtifact = () => setCurrentArtifact((prev) => (prev - 1 + artifacts.length) % artifacts.length);

  const renderCodeView = () => (
    <div className="h-full overflow-auto">
      <div className="flex space-x-2 mb-2">
        {['html', 'css', 'js'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1 rounded ${
              selectedTab === tab ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <SyntaxHighlighter
        language={selectedTab}
        style={vscDarkPlus}
        className="h-full"
      >
        {artifacts[currentArtifact][selectedTab]}
      </SyntaxHighlighter>
    </div>
  );

  return (
    <div className="w-1/3 flex-shrink-0 border-l border-gray-700 relative bg-gray-800">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button onClick={toggleCodeView} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          {isCodeView ? <Eye size={20} /> : <Code size={20} />}
        </button>
        <button onClick={toggleFullscreen} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <Maximize2 size={20} />
        </button>
        <button onClick={closePreview} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex justify-between items-center p-2">
        <button onClick={prevArtifact} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span>Artifact {currentArtifact + 1} of {artifacts.length}</span>
        <button onClick={nextArtifact} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="h-full overflow-auto">
        {isCodeView ? (
          renderCodeView()
        ) : (
          <SandboxedHtmlPreview
            ref={iframeRef}
            htmlContent={artifacts[currentArtifact].html}
            cssContent={artifacts[currentArtifact].css}
            jsContent={artifacts[currentArtifact].js}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
