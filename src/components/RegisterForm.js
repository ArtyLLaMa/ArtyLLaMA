import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RegisterForm = () => {
  const [username, setUsername] = useState(''); // Default values can be removed
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/register', {
        username,
        password,
      });
      const { token } = response.data;
      login(token);
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md"
      >
        <h2 className="text-xl mb-4 text-gray-800 dark:text-gray-200">
          Register
        </h2>
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
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
