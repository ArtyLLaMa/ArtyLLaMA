import React from 'react';
import { Code, Eye, Maximize2, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SandboxedHtmlPreview from './SandboxedHtmlPreview';

const PreviewPanel = ({ showCode, toggleCodeView, toggleExpand, codeLanguage, previewContent, closePreview }) => (
  <div className="w-1/3 flex-shrink-0 border-l border-gray-700 relative bg-gray-800">
    <div className="absolute top-2 right-2 z-10 flex space-x-2">
      <button onClick={toggleCodeView} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
        {showCode ? <Eye size={20} /> : <Code size={20} />}
      </button>
      <button onClick={toggleExpand} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
        <Maximize2 size={20} />
      </button>
      <button onClick={closePreview} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
        <X size={20} />
      </button>
    </div>
    <div className="h-full overflow-auto">
      {showCode ? (
        <SyntaxHighlighter language={codeLanguage} style={vscDarkPlus} className="h-full">
          {previewContent}
        </SyntaxHighlighter>
      ) : (
        <SandboxedHtmlPreview htmlContent={previewContent} />
      )}
    </div>
  </div>
);

export default PreviewPanel;