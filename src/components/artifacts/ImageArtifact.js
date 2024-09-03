import React from 'react';
import DOMPurify from 'dompurify';

const ImageArtifact = ({ content }) => {
  console.log('ImageArtifact content:', content); // Debug log

  if (content.trim().startsWith('<svg')) {
    const sanitizedSvg = DOMPurify.sanitize(content, {
      USE_PROFILES: { svg: true },
      ADD_TAGS: ['svg', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'g', 'text'],
      ADD_ATTR: ['viewBox', 'width', 'height', 'xmlns', 'version', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'transform', 'style', 'fill', 'stroke', 'stroke-width', 'points']
    });
    
    return (
      <div className="svg-container" style={{ maxWidth: '100%', height: 'auto' }}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedSvg }} />
      </div>
    );
  } else if (content.match(/\.(png|jpg|jpeg|gif)$/i)) {
    return <img src={content} alt="Generated content" className="max-w-full h-auto" />;
  } else {
    console.error('Unsupported image format:', content);
    return <div>Unsupported image format</div>;
  }
};

export default ImageArtifact;
