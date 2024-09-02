import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const ModelManagement = ({ onModelSelect, selectedModel }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/models');
      const text = await response.text(); // Get the raw text of the response
      console.log('Raw response:', text);
      
      if (!response.ok) throw new Error(`Failed to fetch models: ${response.statusText}`);
      
      const data = JSON.parse(text); // Parse it manually
      setModels(data.models);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const options = models.map(model => ({ value: model.name, label: model.name }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Model Management</h2>
      {loading ? (
        <p>Loading models...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
      )}
    </div>
  );
};

export default ModelManagement;
