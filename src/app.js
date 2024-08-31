import React from 'react';
import LLMChatInterface from './components/LLMChatInterface';

function App() {
  return (
    <div className="App h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 text-white py-2 px-4">
        <h1 className="text-xl font-bold">ArtyLLaMa</h1>
      </header>
      <main className="flex-grow  overflow-hidden">
        <LLMChatInterface />
      </main>
    </div>
  );
}

export default App;
