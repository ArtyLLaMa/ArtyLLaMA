import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

const SandboxedHtmlPreview = ({ htmlContent }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Configure DOMPurify to allow scripts and canvas
      const purifyConfig = { ADD_TAGS: ["script", "canvas"], FORCE_BODY: true };
      const sanitizedHtml = DOMPurify.sanitize(htmlContent, purifyConfig);
      
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.6;
                color: #333;
                padding: 20px;
                margin: 0;
                background-color: #f0f0f0;
              }
              canvas { 
                border: 1px solid #000;
                display: block;
                margin: 0 auto;
              }
            </style>
          </head>
          <body>${sanitizedHtml}</body>
        </html>
      `], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      if (iframeRef.current) {
        iframeRef.current.onload = () => setIsLoading(false);
        iframeRef.current.onerror = () => {
          setError('Failed to load content');
          setIsLoading(false);
        };
        iframeRef.current.src = url;
      }

      return () => URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error processing HTML content');
      setIsLoading(false);
    }
  }, [htmlContent]);

  return (
    <div className="relative w-full h-full bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        className="w-full h-full border-none bg-white"
        title="HTML Preview"
      />
    </div>
  );
};

export default SandboxedHtmlPreview;