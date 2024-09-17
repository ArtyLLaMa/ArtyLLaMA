import React from 'react';
import LLMChatInterface from './components/LLMChatInterface';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="App h-screen flex flex-col">
        <main className="flex-grow overflow-hidden">
          <LLMChatInterface />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
