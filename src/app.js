import React, { useState, useContext } from 'react';
import LLMChatInterface from './components/LLMChatInterface';
import Login from './components/Login';
import RegisterForm from './components/RegisterForm';
import { ThemeProvider } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext'; // Import AuthContext

function App() {
  const [showRegister, setShowRegister] = useState(false);

  const toggleForm = () => {
    setShowRegister(!showRegister);
  };

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <ThemeProvider>
      <div className="App h-screen flex flex-col">
        <main className="flex-grow overflow-hidden">
          {isAuthenticated ? (
            <LLMChatInterface />
          ) : showRegister ? (
            <RegisterForm onToggleForm={toggleForm} />
          ) : (
            <Login onToggleForm={toggleForm} />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
