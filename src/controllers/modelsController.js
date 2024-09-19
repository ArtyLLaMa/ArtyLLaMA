const axios = require('axios');
const { OpenAI } = require('openai');
const { getUserPreferences } = require('../utils/userPreferencesManager');
const { executeUpdateScript } = require('../utils/updateScript');

const getAvailableModels = async () => {
  let allModels = [];
  const preferences = await getUserPreferences();
  const apiKeys = preferences.apiKeys || {};

  if (apiKeys.OLLAMA_API_URL) {
    try {
      const ollamaResponse = await axios.get(`${apiKeys.OLLAMA_API_URL}/api/tags`);
      allModels = [...allModels, ...ollamaResponse.data.models];
    } catch (error) {
      console.error('Error fetching Ollama models:', error.message);
    }
  }

  if (apiKeys.ANTHROPIC_API_KEY) {
    const anthropicModels = [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
    allModels = [...allModels, ...anthropicModels.map(name => ({ name }))];
  }

  if (apiKeys.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: apiKeys.OPENAI_API_KEY });
      const openaiModelsResponse = await openai.models.list();
      const chatModels = openaiModelsResponse.data.filter(
        model => model.id.includes('gpt') || model.id.includes('text-davinci')
      );
      allModels = [...allModels, ...chatModels.map(model => ({ name: model.id }))];
    } catch (error) {
      console.error('Error fetching OpenAI models:', error.message);
    }
  }

  return allModels;
};

exports.getModels = async (req, res) => {
  try {
    const models = await getAvailableModels();
    res.json({ models });
  } catch (error) {
    console.error('Error in getModels:', error);
    res.status(500).json({ error: 'Failed to fetch models', details: error.message });
  }
};

exports.updateOllamaModels = async (req, res) => {
  try {
    const output = await executeUpdateScript();
    res.json({
      message: 'Ollama models update successful',
      output: output,
    });
  } catch (error) {
    console.error('Error updating Ollama models:', error);
    res.status(500).json({
      error: 'Failed to update Ollama models',
      details: error.message,
    });
  }
};
