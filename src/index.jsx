import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import App from './app.jsx';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
