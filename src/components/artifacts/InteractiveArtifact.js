import React, { useEffect, useRef } from 'react';

const InteractiveArtifact = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const currentContainer = containerRef.current;

    if (currentContainer) {
      // Clear previous content
      currentContainer.innerHTML = '';

      // Create a new script element
      const script = document.createElement('script');
      script.text = content;

      // Append the script to the container
      currentContainer.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [content]);

  return <div ref={containerRef} className="interactive-artifact" />;
};

export default InteractiveArtifact;
