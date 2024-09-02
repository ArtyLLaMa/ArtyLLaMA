import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import DOMPurify from 'dompurify';

const SandboxedHtmlPreview = forwardRef(({ htmlContent, cssContent, jsContent }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const createSanitizedContent = useCallback(() => {
    const purifyConfig = { ADD_TAGS: ["script", "canvas"], FORCE_BODY: true };
    const sanitizedHtml = DOMPurify.sanitize(htmlContent, purifyConfig);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${cssContent}</style>
        </head>
        <body>${sanitizedHtml}</body>
        <script>${jsContent}</script>
      </html>
    `;
  }, [htmlContent, cssContent, jsContent]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      const fullContent = createSanitizedContent();

      if (ref.current) {
        ref.current.onload = () => setIsLoading(false);
        ref.current.onerror = () => {
          setError('Failed to load content');
          setIsLoading(false);
        };
        ref.current.srcdoc = fullContent;
      }
    } catch (err) {
      setError('Error processing HTML content');
      setIsLoading(false);
    }
  }, [createSanitizedContent, ref]);

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
        ref={ref}
        sandbox="allow-scripts"
        className="w-full h-full border-none bg-white"
        title="HTML Preview"
      />
    </div>
  );
});

SandboxedHtmlPreview.displayName = 'SandboxedHtmlPreview';

export default SandboxedHtmlPreview;
