import React from 'react';
import LLMChatInterface from './components/LLMChatInterface';

function App() {
  return (
    <div className="App h-screen flex flex-col bg-gray-900">
      <main className="flex-grow  overflow-hidden">
        <LLMChatInterface />
      </main>
    </div>
  );
}

export default App;
