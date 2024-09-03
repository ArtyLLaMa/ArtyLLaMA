import DOMPurify from 'dompurify';

export const ARTIFACT_TYPES = {
  CODE: 'code',
  IMAGE: 'image',
  CHART: 'chart',
  TABLE: 'table',
  INTERACTIVE: 'interactive',
  HTML: 'html',
  REACT: 'react',
  MERMAID: 'mermaid',
};

function detectArtifactType(content, specifiedType) {
  if (specifiedType) {
    return specifiedType.toLowerCase();
  }
  
  if (content.startsWith('<svg') || content.match(/\.(png|jpg|jpeg|gif)$/i)) {
    return ARTIFACT_TYPES.IMAGE;
  } else if (content.includes('```') || content.match(/^[a-z]+\s*\{/i)) {
    return ARTIFACT_TYPES.CODE;
  } else if (content.includes('<table')) {
    return ARTIFACT_TYPES.TABLE;
  } else if (content.includes('chart.js') || content.includes('plotly')) {
    return ARTIFACT_TYPES.CHART;
  } else if (content.includes('<script') || content.includes('addEventListener')) {
    return ARTIFACT_TYPES.INTERACTIVE;
  } else if (content.includes('import React') || content.includes('from "react"')) {
    return ARTIFACT_TYPES.REACT;
  } else if (content.includes('graph TD') || content.includes('sequenceDiagram')) {
    return ARTIFACT_TYPES.MERMAID;
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
  if (type === ARTIFACT_TYPES.IMAGE && content.startsWith('<svg')) {
    return DOMPurify.sanitize(content, { USE_PROFILES: { svg: true } });
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
    const languageMatch = fullMatch.match(/language="([^"]*)"/);

    const identifier = identifierMatch ? identifierMatch[1] : `artifact-${artifacts.length}`;
    const title = titleMatch ? titleMatch[1] : 'Untitled Artifact';
    const specifiedType = typeMatch ? typeMatch[1] : null;
    const language = languageMatch ? languageMatch[1] : null;

    const detectedType = detectArtifactType(artifactContent, specifiedType);
    const sanitizedContent = sanitizeContent(artifactContent, detectedType);

    artifacts.push({
      identifier,
      title,
      type: detectedType,
      language,
      content: sanitizedContent,
    });
  }

  return artifacts;
}

//export { ARTIFACT_TYPES };
