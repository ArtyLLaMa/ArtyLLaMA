const axios = require('axios');
const { OLLAMA_API_URL, ANTHROPIC_API_KEY, OPENAI_API_KEY } = require('../config/environment');
const { OpenAI } = require('openai');

exports.getAvailableModels = async () => {
  let allModels = [];

  if (OLLAMA_API_URL) {
    try {
      const ollamaResponse = await axios.get(`${OLLAMA_API_URL}/api/tags`);
      allModels = [...allModels, ...ollamaResponse.data.models];
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
    }
  }

  if (ANTHROPIC_API_KEY) {
    const anthropicModels = [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
    allModels = [...allModels, ...anthropicModels.map(name => ({ name }))];
  }

  if (OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      const openaiModelsResponse = await openai.models.list();
      const chatModels = openaiModelsResponse.data.filter(
        model => model.id.includes('gpt') || model.id.includes('text-davinci')
      );
      allModels = [...allModels, ...chatModels.map(model => ({ name: model.id }))];
    } catch (error) {
      console.error('Error fetching OpenAI models:', error);
    }
  }

  return allModels;
};
