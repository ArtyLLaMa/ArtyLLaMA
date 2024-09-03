import React from 'react';
import CodeArtifact from './artifacts/CodeArtifact';
import ImageArtifact from './artifacts/ImageArtifact';
import ChartArtifact from './artifacts/ChartArtifact';
import TableArtifact from './artifacts/TableArtifact';
import InteractiveArtifact from './artifacts/InteractiveArtifact';
import HTMLArtifact from './artifacts/HTMLArtifact';
import DOMPurify from 'dompurify';

export const ARTIFACT_TYPES = {
    CODE: 'code',
    IMAGE: 'image',
    CHART: 'chart',
    TABLE: 'table',
    INTERACTIVE: 'interactive',
    HTML: 'html',
  };
  
  export const ArtifactRenderer = ({ artifact }) => {
    console.log('ArtifactRenderer received:', artifact); // Debug log
  
    const normalizedType = artifact.type.toLowerCase();
    
    switch (normalizedType) {
      case ARTIFACT_TYPES.CODE:
        return <CodeArtifact content={artifact.content} />;
      case ARTIFACT_TYPES.IMAGE:
        return <ImageArtifact content={artifact.content} />;
      case ARTIFACT_TYPES.CHART:
        return <ChartArtifact content={artifact.content} />;
      case ARTIFACT_TYPES.TABLE:
        return <TableArtifact content={artifact.content} />;
      case ARTIFACT_TYPES.INTERACTIVE:
        return <InteractiveArtifact content={artifact.content} />;
      case ARTIFACT_TYPES.HTML:
        return <HTMLArtifact content={artifact.content} />;
      default:
        console.error('Unknown artifact type:', artifact.type);
        return <div>Unknown artifact type: {artifact.type}</div>;
    }
}

function detectArtifactType(content) {
  if (content.trim().startsWith('<svg') || content.match(/\.(png|jpg|jpeg|gif)$/i)) {
    return ARTIFACT_TYPES.IMAGE;
  } else if (content.includes('```') || content.match(/^[a-z]+\s*\{/i)) {
    return ARTIFACT_TYPES.CODE;
  } else if (content.includes('<table')) {
    return ARTIFACT_TYPES.TABLE;
  } else if (content.includes('chart.js') || content.includes('plotly')) {
    return ARTIFACT_TYPES.CHART;
  } else if (content.includes('<script') || content.includes('addEventListener')) {
    return ARTIFACT_TYPES.INTERACTIVE;
  } else if (content.includes('<html') || content.includes('<body')) {
    return ARTIFACT_TYPES.HTML;
  }
  return ARTIFACT_TYPES.HTML; // Default to HTML if no specific type is detected
}

function sanitizeContent(content, type) {
    if (type === ARTIFACT_TYPES.HTML || type === ARTIFACT_TYPES.INTERACTIVE) {
      return DOMPurify.sanitize(content, {
        ADD_TAGS: ['script'], // Allow scripts for interactive content
        FORBID_TAGS: ['style'], // Disallow inline styles for security
        FORBID_ATTR: ['onerror', 'onload'], // Disallow potentially dangerous event handlers
      });
    }
    if (type === ARTIFACT_TYPES.IMAGE && content.trim().startsWith('<svg')) {
      // For SVG, return as-is to be sanitized in the ImageArtifact component
      return content;
    }
    return content; // For other types, return as-is
  }

export function parseArtifacts(content) {
    const artifactRegex = /<antArtifact[^>]*>([\s\S]*?)<\/antArtifact>/gi;
    const artifacts = [];
    let match;
  
    while ((match = artifactRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const artifactContent = match[1];
  
      const identifierMatch = fullMatch.match(/identifier="([^"]*)"/);
      const titleMatch = fullMatch.match(/title="([^"]*)"/);
      const typeMatch = fullMatch.match(/type="([^"]*)"/);
  
      const identifier = identifierMatch ? identifierMatch[1] : `artifact-${artifacts.length}`;
      const title = titleMatch ? titleMatch[1] : 'Untitled Artifact';
      const specifiedType = typeMatch ? typeMatch[1].toLowerCase() : null;
  
      const detectedType = specifiedType || detectArtifactType(artifactContent);
      
      // Don't sanitize SVG content here, leave it for the ImageArtifact component
      const finalContent = detectedType.toLowerCase() === ARTIFACT_TYPES.IMAGE && artifactContent.trim().startsWith('<svg')
        ? artifactContent
        : sanitizeContent(artifactContent, detectedType);
  
      artifacts.push({
        identifier,
        title,
        type: detectedType,
        content: finalContent,
      });
    }
  
    console.log('Parsed artifacts:', artifacts); // Debug log
  
    return artifacts;
  }
