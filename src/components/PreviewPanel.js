import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ArtifactRenderer } from './ArtifactRenderer';

const PreviewPanel = ({ artifacts, closePreview }) => {
  const [currentArtifactIndex, setCurrentArtifactIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    console.log('Artifacts in PreviewPanel:', artifacts); // Debug log
  }, [artifacts]);

  const nextArtifact = () => {
    setCurrentArtifactIndex((prev) => (prev + 1) % artifacts.length);
  };

  const prevArtifact = () => {
    setCurrentArtifactIndex((prev) => (prev - 1 + artifacts.length) % artifacts.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const currentArtifact = artifacts[currentArtifactIndex];

  if (!currentArtifact) {
    return <div>No artifacts to display</div>;
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'w-1/3 flex-shrink-0'} border-l border-gray-700 relative bg-gray-800`}>
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
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
        <span>Artifact {currentArtifactIndex + 1} of {artifacts.length}</span>
        <button onClick={nextArtifact} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="h-full overflow-auto p-4">
        <h2 className="text-xl font-bold mb-2">{currentArtifact.title}</h2>
        <div className="artifact-content">
          <ArtifactRenderer artifact={currentArtifact} />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Debug Info:</h3>
          <pre className="bg-gray-900 p-2 rounded overflow-auto">
            {JSON.stringify(currentArtifact, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;