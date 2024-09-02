import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeArtifact = ({ content }) => {
  const language = detectLanguage(content);

  return (
    <div className="code-artifact">
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

function detectLanguage(code) {
  // Simple language detection logic
  if (code.includes('function') || code.includes('var') || code.includes('const')) {
    return 'javascript';
  } else if (code.includes('def ') || code.includes('import ')) {
    return 'python';
  } else if (code.includes('public class') || code.includes('System.out.println')) {
    return 'java';
  }
  return 'text'; // Default to plain text if language can't be detected
}

export default CodeArtifact;