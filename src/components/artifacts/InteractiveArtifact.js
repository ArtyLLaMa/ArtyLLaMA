import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

const InteractiveArtifact = ({ content }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const currentContainer = containerRef.current;

    if (currentContainer) {
      try {
        // Sanitize the HTML content
        const sanitizedContent = DOMPurify.sanitize(content, {
          ADD_TAGS: ['script'],
          ADD_ATTR: ['onclick'],
        });

        // Set the sanitized HTML content
        currentContainer.innerHTML = sanitizedContent;

        // Define fallback functions
        const fallbackIncrement = () => setCount(prevCount => prevCount + 1);
        const fallbackDecrement = () => setCount(prevCount => prevCount - 1);

        // Get all buttons
        const buttons = currentContainer.getElementsByTagName('button');
        
        // Add click event listeners to buttons
        Array.from(buttons).forEach(button => {
          if (button.textContent.toLowerCase().includes('increment')) {
            button.onclick = () => {
              if (typeof window.increment === 'function') {
                window.increment();
              } else {
                fallbackIncrement();
              }
            };
          } else if (button.textContent.toLowerCase().includes('decrement')) {
            button.onclick = () => {
              if (typeof window.decrement === 'function') {
                window.decrement();
              } else {
                fallbackDecrement();
              }
            };
          }
        });

        // Execute scripts manually
        const scripts = currentContainer.getElementsByTagName('script');
        Array.from(scripts).forEach(script => {
          const newScript = document.createElement('script');
          Array.from(script.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(script.innerHTML));
          script.parentNode.replaceChild(newScript, script);
        });

        // Update display if needed
        const displayElement = currentContainer.getElementById('display');
        if (displayElement) {
          const updateDisplay = () => {
            displayElement.innerText = count;
          };
          updateDisplay();
          setCount(prevCount => {
            updateDisplay();
            return prevCount;
          });
        }

        setError(null);
      } catch (e) {
        console.error('Error in interactive content:', e);
        setError(`Error: ${e.message}`);
      }
    }

    // Cleanup function
    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [content, count]);

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
