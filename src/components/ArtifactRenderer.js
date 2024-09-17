// ./src/components/ArtifactRenderer.js
import React from 'react';
import CodeArtifact from './artifacts/CodeArtifact';
import ImageArtifact from './artifacts/ImageArtifact';
import ChartArtifact from './artifacts/ChartArtifact';
import TableArtifact from './artifacts/TableArtifact';
import InteractiveArtifact from './artifacts/InteractiveArtifact';
import HTMLArtifact from './artifacts/HTMLArtifact';
import MermaidArtifact from './artifacts/MermaidArtifact';
import GameArtifact from './artifacts/GameArtifact';
import ThreeJSArtifact from './artifacts/ThreeJSArtifact';

export const ARTIFACT_TYPES = {
  CODE: 'code',
  IMAGE: 'image',
  CHART: 'chart',
  TABLE: 'table',
  INTERACTIVE: 'interactive',
  HTML: 'html',
  MERMAID: 'mermaid',
  GAME: 'game',
  THREEJS: 'threejs',
};

export const ArtifactRenderer = ({ artifact }) => {
  const normalizedType = artifact.type.toLowerCase();

  const renderContent = () => {
    switch (normalizedType) {
      case ARTIFACT_TYPES.CODE:
        return <CodeArtifact content={artifact.content} language={artifact.language} />;
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
      case ARTIFACT_TYPES.MERMAID:
        return <MermaidArtifact content={artifact.content} />;
      case ARTIFACT_TYPES.GAME:
        return <GameArtifact content={artifact.content} />;
      case ARTIFACT_TYPES.THREEJS:
        return <ThreeJSArtifact content={artifact.content} />;
      default:
        return <div>Unknown artifact type: {artifact.type}</div>;
    }
  };

  return <div className="artifact-renderer">{renderContent()}</div>;
};
