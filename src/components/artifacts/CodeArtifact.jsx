import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardCopy, Check } from 'lucide-react';

const CodeArtifact = ({ content, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const detectedLanguage = language || detectLanguage(content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const customStyle = {
    ...atomDark,
    'pre[class*="language-"]': {
      ...atomDark['pre[class*="language-"]'],
      background: '#1E1E1E',
      padding: '1em',
      borderRadius: '0.5em',
      overflow: 'auto',
    },
  };

  return (
    <div className="code-artifact relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          title={isCopied ? "Copied!" : "Copy to clipboard"}
        >
          {isCopied ? <Check size={20} /> : <ClipboardCopy size={20} />}
        </button>
      </div>
      <SyntaxHighlighter 
        language={detectedLanguage} 
        style={customStyle}
        showLineNumbers={true}
        wrapLines={true}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

function detectLanguage(code) {
  // Enhanced language detection logic
  const languagePatterns = {
    javascript: /\b(function|const|let|var|=>)\b/,
    python: /\b(def|import|from|class)\b/,
    java: /\b(public|class|void|int|String)\b/,
    html: /<\/?[a-z][\s\S]*>/i,
    css: /[{}:;]/,
    sql: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE)\b/i,
    bash: /\b(echo|export|source|if|\[|\])\b/,
    // Add more languages as needed
  };

  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(code)) {
      return lang;
    }
  }

  return 'text'; // Default to plain text if language can't be detected
}

export default CodeArtifact;
