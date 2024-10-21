import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

function MermaidDiagram({ content }) {
  const diagramRef = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);
  const [showRawContent, setShowRawContent] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "monospace",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
        rankSpacing: 80,
        nodeSpacing: 50,
      },
      themeVariables: {
        fontFamily: "monospace",
        fontSize: "14px",
        primaryColor: "#5f9ea0",
        primaryTextColor: "#fff",
        primaryBorderColor: "#7f7f7f",
        lineColor: "#8097a2",
        secondaryColor: "#4f6778",
        tertiaryColor: "#37474f",
      },
    });

    const renderDiagram = async () => {
      let tempContainer = null;
      try {
        console.log("Original content:", content);
        const cleanedContent = content.trim().replace(/\\n/g, "\n");
        console.log("Cleaned content:", cleanedContent);
        const diagramId = `mermaid-diagram-${Date.now()}`;

        tempContainer = document.createElement("div");
        tempContainer.id = diagramId;
        document.body.appendChild(tempContainer);

        const { svg } = await mermaid.render(diagramId, cleanedContent);

        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Error rendering Mermaid diagram:", err);
        setError(`Failed to render the diagram: ${err.message}`);
        setSvg("");
      } finally {
        if (tempContainer && tempContainer.parentNode) {
          tempContainer.parentNode.removeChild(tempContainer);
        }
      }
    };

    renderDiagram();
  }, [content]);

  useEffect(() => {
    console.log("Content prop changed:", content);
  }, [content]);

  return (
    <div className="mermaid-diagram w-full h-full flex flex-col">
      {error && (
        <div className="error-message bg-red-600 text-white p-2 rounded mb-2">
          {error}
        </div>
      )}
      {(error || showRawContent) && (
        <pre className="raw-content bg-gray-900 p-4 rounded overflow-auto max-h-60 mb-2 text-sm">
          {content}
        </pre>
      )}
      {!error && (
        <button
          onClick={() => setShowRawContent(!showRawContent)}
          className="mb-2 px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          {showRawContent ? "Hide" : "Show"} Raw Content
        </button>
      )}
      {!error && svg && (
        <div
          ref={diagramRef}
          className="mermaid-svg-container flex-grow overflow-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}

export default MermaidDiagram;
