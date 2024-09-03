import React, { useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

const HTMLArtifact = ({ content }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

      // Sanitize the HTML content
      const sanitizedContent = DOMPurify.sanitize(content, {
        ADD_TAGS: ['script', 'link'],
        ADD_ATTR: ['href', 'src'],
      });

      // Create a full HTML document structure
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
          <style>
            body { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${sanitizedContent}
        </body>
        </html>
      `;

      iframeDocument.open();
      iframeDocument.write(htmlContent);
      iframeDocument.close();

      const adjustIframeHeight = () => {
        if (iframeDocument.body) {
          iframe.style.height = `${iframeDocument.body.scrollHeight}px`;
        }
      };

      // Initial adjustment
      iframe.onload = adjustIframeHeight;

      // Periodic adjustment
      const intervalId = setInterval(adjustIframeHeight, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [content]);

  return (
    <div className="html-artifact">
      <iframe
        ref={iframeRef}
        title="HTML Content"
        className="w-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default HTMLArtifact;