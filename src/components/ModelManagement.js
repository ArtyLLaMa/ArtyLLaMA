import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const ModelManagement = ({ onModelSelect, selectedModel }) => {
  const [models, setModels] = useState([]);
  const [newModelName, setNewModelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_OLLAMA_API_URL}/api/tags`);
      if (!response.ok) throw new Error('Failed to fetch models');
      const data = await response.json();
      setModels(data.models);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pullModel = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_OLLAMA_API_URL}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newModelName }),
      });
      if (!response.ok) throw new Error('Failed to pull model');
      await fetchModels();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (modelName) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_OLLAMA_API_URL}/api/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName }),
      });
      if (!response.ok) throw new Error('Failed to delete model');
      await fetchModels();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const options = models.map(model => ({ value: model.name, label: model.name }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Model Management</h2>
      <Select
        options={options}
        value={options.find(option => option.value === selectedModel)}
        onChange={(selectedOption) => onModelSelect(selectedOption.value)}
        className="mb-4"
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: '#374151',
            borderColor: '#4B5563',
          }),
          singleValue: (provided) => ({
            ...provided,
            color: '#D1D5DB',
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: '#374151',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4B5563' : '#374151',
            color: '#D1D5DB',
            '&:hover': {
              backgroundColor: '#4B5563',
            },
          }),
        }}
      />
      <div className="mb-4">
        <input
          type="text"
          value={newModelName}
          onChange={(e) => setNewModelName(e.target.value)}
          placeholder="Enter model name"
          className="mr-2 p-2 border rounded bg-gray-700 text-white"
        />
        <button onClick={pullModel} className="bg-blue-500 text-white p-2 rounded">
          Pull Model
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {models.map((model) => (
          <li key={model.name} className="flex justify-between items-center mb-2">
            <span>{model.name}</span>
            <button
              onClick={() => deleteModel(model.name)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelManagement;
