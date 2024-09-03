import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, ChevronDown } from 'lucide-react';
import { ArtifactRenderer } from './ArtifactRenderer';

const PreviewPanel = ({ artifacts, closePreview, expandArtifact }) => {
  const [currentArtifactIndex, setCurrentArtifactIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Automatically set the index to the last artifact when a new one is added
    setCurrentArtifactIndex(artifacts.length - 1);
  }, [artifacts.length]);

  const nextArtifact = () => {
    setCurrentArtifactIndex((prev) => (prev + 1) % artifacts.length);
  };

  const prevArtifact = () => {
    setCurrentArtifactIndex((prev) => (prev - 1 + artifacts.length) % artifacts.length);
  };

  const currentArtifact = artifacts[currentArtifactIndex];

  if (!currentArtifact) {
    return <div>No artifacts to display</div>;
  }

  return (
    <div className="w-1/3 flex-shrink-0 border-l border-gray-700 relative bg-gray-800 flex flex-col">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button onClick={() => expandArtifact(currentArtifact)} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <Maximize2 size={20} />
        </button>
        <button onClick={closePreview} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex justify-between items-center p-2 border-b border-gray-700">
        <button onClick={prevArtifact} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="flex items-center space-x-1 bg-gray-700 rounded px-2 py-1 hover:bg-gray-600 transition-colors"
          >
            <span>Artifact {currentArtifactIndex + 1} of {artifacts.length}</span>
            <ChevronDown size={16} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 rounded shadow-lg z-20 max-h-60 overflow-y-auto">
              {artifacts.map((artifact, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentArtifactIndex(index);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-gray-600 transition-colors"
                >
                  {artifact.title || `Artifact ${index + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={nextArtifact} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 p-2 ${activeTab === 'preview' ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 transition-colors`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 p-2 ${activeTab === 'code' ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 transition-colors`}
        >
          Code
        </button>
        <button
          onClick={() => setActiveTab('debug')}
          className={`flex-1 p-2 ${activeTab === 'debug' ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 transition-colors`}
        >
          Debug Info
        </button>
      </div>
      <div className="flex-grow overflow-auto p-4">
        <h2 className="text-xl font-bold mb-2">{currentArtifact.title}</h2>
        {activeTab === 'preview' && (
          <div className="artifact-content max-h-[calc(100vh-200px)] overflow-auto">
            <ArtifactRenderer artifact={currentArtifact} />
          </div>
        )}
        {activeTab === 'code' && (
          <pre className="bg-gray-900 p-2 rounded overflow-auto max-h-[calc(100vh-200px)]">
            <code>{currentArtifact.content}</code>
          </pre>
        )}
        {activeTab === 'debug' && (
          <pre className="bg-gray-900 p-2 rounded overflow-auto max-h-[calc(100vh-200px)]">
            {JSON.stringify(currentArtifact, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
