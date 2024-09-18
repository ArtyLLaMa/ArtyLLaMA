import React, { useEffect, useRef, useState } from 'react';

const GameArtifact = ({ content }) => {
  const gameRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

      // Set iframe content
      iframe.srcdoc = content;

      // Append iframe to the DOM
      gameRef.current.appendChild(iframe);
    } catch (err) {
      console.error("GameArtifact Error:", err);
      setError("Failed to load the game. Please check the artifact content.");
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) gameRef.current.innerHTML = '';
    };
  }, [content]);

  return (
    <div className="game-artifact">
      {error ? (
        <div className="error-message bg-red-600 text-white p-2 rounded">
          {error}
        </div>
      ) : (
        <div ref={gameRef} />
      )}
    </div>
  );
};

export default GameArtifact;
