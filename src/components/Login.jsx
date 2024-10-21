import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = ({ onToggleForm }) => {
  const [username, setUsername] = useState(''); // Default values can be removed
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      const { token } = response.data;
      login(token);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md"
      >
        <h2 className="text-xl mb-4 text-gray-800 dark:text-gray-200">Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onToggleForm}
            className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
          >
            Don't have an account? Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
