import React from 'react';
import { X, Code, Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SandboxedHtmlPreview from './SandboxedHtmlPreview';

const ExpandedPreviewModal = ({ toggleExpand, showCode, toggleCodeView, codeLanguage, previewContent }) => {
  const handleClose = (e) => {
    e.stopPropagation();
    toggleExpand();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-gray-800 w-11/12 h-5/6 rounded-lg shadow-xl relative" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={toggleCodeView} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            {showCode ? <Eye size={20} /> : <Code size={20} />}
          </button>
          <button onClick={handleClose} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="h-full overflow-auto p-4">
          {showCode ? (
            <SyntaxHighlighter language={codeLanguage} style={vscDarkPlus} className="h-full">
              {previewContent}
            </SyntaxHighlighter>
          ) : (
            <SandboxedHtmlPreview htmlContent={previewContent} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandedPreviewModal;