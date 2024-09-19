const { Anthropic } = require('@anthropic-ai/sdk');
const { OpenAI } = require('openai');
const { getUserPreferences } = require('./userPreferencesManager');

let anthropic;
let openai;
let ollamaApiUrl;

exports.initializeApiClients = async () => {
  try {
    const preferences = await getUserPreferences();
    const apiKeys = preferences.apiKeys || {};

    if (apiKeys.ANTHROPIC_API_KEY) {
      anthropic = new Anthropic({ apiKey: apiKeys.ANTHROPIC_API_KEY });
    } else if (process.env.ANTHROPIC_API_KEY) {
      console.warn('Using ANTHROPIC_API_KEY from environment variables. Consider updating your user preferences.');
      anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    } else {
      console.log('Anthropic API key not found. Anthropic features will be disabled.');
    }

    if (apiKeys.OPENAI_API_KEY) {
      openai = new OpenAI({ apiKey: apiKeys.OPENAI_API_KEY });
    } else if (process.env.OPENAI_API_KEY) {
      console.warn('Using OPENAI_API_KEY from environment variables. Consider updating your user preferences.');
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } else {
      console.log('OpenAI API key not found. OpenAI features will be disabled.');
    }

    ollamaApiUrl = apiKeys.OLLAMA_API_URL || process.env.OLLAMA_API_URL;
    if (!ollamaApiUrl) {
      console.log('Ollama API URL not found. Ollama features will be disabled.');
    }
  } catch (error) {
    console.error('Error initializing API clients:', error);
  }
};

exports.getAnthropicClient = () => anthropic;
exports.getOpenAIClient = () => openai;
exports.getOllamaApiUrl = () => ollamaApiUrl;
