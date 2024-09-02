import React from 'react';
import DOMPurify from 'dompurify';

const HTMLArtifact = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ['script'], // Allow scripts
    FORBID_TAGS: ['style'], // Disallow inline styles for security
    FORBID_ATTR: ['onerror', 'onload'], // Disallow potentially dangerous event handlers
  });

  return (
    <div 
      className="html-artifact"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default HTMLArtifact;