const axios = require('axios');
const { OLLAMA_API_URL } = require('../config/environment');

exports.processOllamaChat = async (model, messages, onChunk) => {
  if (!OLLAMA_API_URL) {
    throw new Error('Ollama API URL is not configured.');
  }

  const ollamaUrl = `${OLLAMA_API_URL}/api/chat`;
  
  try {
    const response = await axios.post(
      ollamaUrl,
      {
        model,
        messages,
        stream: true,
      },
      {
        responseType: 'stream',
      }
    );

    response.data.on('data', (chunk) => {
      const lines = chunk.toString('utf8').split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        try {
          const parsedLine = JSON.parse(line);
          if (parsedLine.message && parsedLine.message.content) {
            onChunk(parsedLine.message.content, 'ollama');
          }
          if (parsedLine.done) {
            onChunk('[DONE]', 'ollama');
          }
        } catch (parseError) {
          console.error('Error parsing Ollama chunk:', parseError);
        }
      }
    });

    response.data.on('error', (error) => {
      console.error('Ollama stream error:', error);
      onChunk('[ERROR]', 'ollama');
    });
  } catch (error) {
    console.error('Ollama API error:', error);
    throw error;
  }
};
