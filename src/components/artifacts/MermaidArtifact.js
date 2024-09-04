import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

function MermaidDiagram({ content }) {
  const diagramRef = useRef(null);
  const [error, setError] = useState(null);
  const [showRawContent, setShowRawContent] = useState(false);

  useEffect(() => {
    if (diagramRef.current) {
      try {
        // Initialize Mermaid
        mermaid.initialize({ startOnLoad: true });
        
        // Render the diagram
        mermaid.contentLoaded();
      } catch (diagramError) {
        console.error("Error rendering Mermaid diagram:", diagramError);
        setError("Failed to render the diagram. Please try again with valid Mermaid syntax.");
      }
    }
  }, [content]);

  return (
    <div className="mermaid-diagram">
      {error && (
        <div className="error-message bg-red-600 text-white p-2 rounded mb-2">
          {error}
          <button 
            onClick={() => setShowRawContent(!showRawContent)}
            className="ml-2 px-2 py-1 bg-red-700 rounded hover:bg-red-800 transition-colors"
          >
            {showRawContent ? "Hide" : "Show"} Raw Content
          </button>
        </div>
      )}
      {showRawContent && (
        <pre className="raw-content bg-gray-900 p-4 rounded overflow-auto max-h-60 mb-2 text-sm">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </pre>
      )}
      {!error && (
        <div ref={diagramRef} className="mermaid">
          {content}
        </div>
      )}
    </div>
  );
}

export default MermaidDiagram;
