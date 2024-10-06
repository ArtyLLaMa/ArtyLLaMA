import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const SessionList = ({ onSelectSession }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axiosInstance.get('/chat/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  return (
    <ul className="session-list">
      {sessions.map((session) => (
        <li key={session.id} className="mb-2">
          <button
            onClick={() => onSelectSession(session.id)}
            className="w-full text-left p-2 bg-gray-800 rounded hover:bg-gray-700"
          >
            {session.title || 'Untitled Chat'}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SessionList;
