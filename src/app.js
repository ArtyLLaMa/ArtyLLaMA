import React, { useState, useEffect } from "react";
import LLMChatInterface from "./components/LLMChatInterface";
import Login from "./components/Login";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider>
      <div className="App h-screen flex flex-col">
        <main className="flex-grow overflow-hidden">
          {isAuthenticated ? (
            <LLMChatInterface />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
