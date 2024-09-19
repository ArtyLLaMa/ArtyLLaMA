const { getAvailableModels } = require('../services/modelsService');
const { executeUpdateScript } = require('../utils/updateScript');

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
