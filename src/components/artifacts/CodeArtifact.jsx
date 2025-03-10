import React, { useState, useEffect } from 'react';
import * as shiki from 'shiki';
import { ClipboardCopy, Check } from 'lucide-react';

const CodeArtifact = ({ content, language }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [shikiHtml, setShikiHtml] = useState('');

  const detectedLanguage = language || detectLanguage(content);

  useEffect(() => {
    shiki.getHighlighter({ theme: "dracula", langs: [detectedLanguage] }).then((highlighter) => {
      setShikiHtml(highlighter.codeToHtml(content, { lang: detectedLanguage }));
    });
  }, [content, detectedLanguage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
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
      <div dangerouslySetInnerHTML={{ __html: shikiHtml }} />
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
