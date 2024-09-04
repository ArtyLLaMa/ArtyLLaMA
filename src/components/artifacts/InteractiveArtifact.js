import React, { useEffect, useRef, useState } from 'react';

const InteractiveArtifact = ({ content }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentContainer = containerRef.current;

    if (currentContainer) {
      // Clear previous content
      currentContainer.innerHTML = '';

      try {
        // Create a sandboxed environment
        const sandbox = {
          console: {
            log: (...args) => console.log('Sandbox:', ...args),
            error: (...args) => console.error('Sandbox:', ...args),
            warn: (...args) => console.warn('Sandbox:', ...args),
          },
          container: currentContainer,
        };

        // Wrap the content in an IIFE and provide the sandbox
        const wrappedContent = `
          (function(sandbox) {
            try {
              ${content}
            } catch (e) {
              sandbox.console.error('Error in interactive content:', e);
              throw e;
            }
          })(this);
        `;

        // Create a new script element
        const script = document.createElement('script');
        script.text = wrappedContent;

        // Append the script to the container
        currentContainer.appendChild(script);

        setError(null);
      } catch (e) {
        console.error('Error executing interactive content:', e);
        setError(`Error: ${e.message}`);
      }
    }

    // Cleanup function
    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [content]);

  return (
    <div className="interactive-artifact">
      {error && (
        <div className="error-message bg-red-600 text-white p-2 rounded mb-2">
          {error}
        </div>
      )}
      <div ref={containerRef} className="interactive-content" />
    </div>
  );
};

export default InteractiveArtifact;
