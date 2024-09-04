import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

function MermaidDiagram({ content }) {
  const diagramRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [showRawContent, setShowRawContent] = useState(false);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'monospace'
    });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-diagram', content);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Error rendering Mermaid diagram:", err);
        setError("Failed to render the diagram. Please check the Mermaid syntax.");
        setSvg('');
      }
    };

    renderDiagram();
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
          {content}
        </pre>
      )}
      {!error && (
        <div 
          ref={diagramRef}
          className="mermaid-svg-container"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}

export default MermaidDiagram;
