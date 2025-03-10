import React, { useState, useEffect } from 'react';
import { Code, Eye, FileText, Minimize2 } from 'lucide-react';
import * as shiki from 'shiki';
import { ArtifactRenderer } from './ArtifactRenderer';

const ExpandedPreviewModal = ({ toggleExpand, artifact }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [highlightedCode, setHighlightedCode] = useState('');

  const handleClose = (e) => {
    e.stopPropagation();
    toggleExpand();
  };

  useEffect(() => {
    if (activeTab === 'code' && artifact?.content) {
      import('shiki').then((shiki) => {
        const detectedLanguage = detectLanguage(artifact.content);
        shiki.codeToHtml(artifact.content, {
          lang: detectedLanguage,
          theme: 'dracula'
        }).then((highlightedHtml) => {
          setHighlightedCode(highlightedHtml);
        });
      }).catch((error) => {
        console.error('Error importing or using shiki:', error);
      });
    }
  }, [activeTab, artifact]);

  function detectLanguage(code) {
    const languagePatterns = {
      javascript: /\b(function|const|let|var|=>)\b/,
      python: /\b(def|import|from|class)\b/,
      java: /\b(public|class|void|int|String)\b/,
      html: /<\/?[a-z][\s\S]*>/i,
      css: /[{}:;]/,
      sql: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE)\b/i,
      bash: /\b(echo|export|source|if|\[|\])\b/,
    };

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(code)) {
        return lang;
      }
    }

    return 'text'; // Fallback for unknown languages
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-11/12 h-5/6 rounded-lg shadow-xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">{artifact.title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`p-2 rounded-full ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              } transition-colors`}
            >
              <Eye size={20} />
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`p-2 rounded-full ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              } transition-colors`}
            >
              <Code size={20} />
            </button>
            <button
              onClick={() => setActiveTab('debug')}
              className={`p-2 rounded-full ${
                activeTab === 'debug'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              } transition-colors`}
            >
              <FileText size={20} />
            </button>
            <button
              onClick={handleClose}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Minimize2 size={20} />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          {activeTab === 'preview' && (
            <div className="h-full">
              <ArtifactRenderer artifact={artifact} key={artifact.identifier} />
            </div>
          )}
          {activeTab === 'code' && (
            <div 
              className="h-full overflow-auto" 
              dangerouslySetInnerHTML={{ __html: highlightedCode.replace('<pre', '<pre style="padding:24px"') }} 
            />
          )}
          {activeTab === 'debug' && (
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto h-full">
              {JSON.stringify(artifact, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandedPreviewModal;
