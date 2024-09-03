import React, { useState } from 'react';
import { X, Code, Eye, FileText, Minimize2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArtifactRenderer } from './ArtifactRenderer';

const ExpandedPreviewModal = ({ toggleExpand, artifact }) => {
  const [activeTab, setActiveTab] = useState('preview');

  const handleClose = (e) => {
    e.stopPropagation();
    toggleExpand();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-gray-800 w-11/12 h-5/6 rounded-lg shadow-xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">{artifact.title}</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('preview')} 
              className={`p-2 rounded-full ${activeTab === 'preview' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
            >
              <Eye size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('code')} 
              className={`p-2 rounded-full ${activeTab === 'code' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
            >
              <Code size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('debug')} 
              className={`p-2 rounded-full ${activeTab === 'debug' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
            >
              <FileText size={20} />
            </button>
            <button onClick={handleClose} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <Minimize2 size={20} />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          {activeTab === 'preview' && (
            <div className="h-full">
              <ArtifactRenderer artifact={artifact} />
            </div>
          )}
          {activeTab === 'code' && (
            <SyntaxHighlighter language={artifact.type === 'code' ? 'javascript' : 'markup'} style={vscDarkPlus} className="h-full">
              {artifact.content}
            </SyntaxHighlighter>
          )}
          {activeTab === 'debug' && (
            <pre className="bg-gray-900 p-4 rounded overflow-auto h-full">
              {JSON.stringify(artifact, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandedPreviewModal;