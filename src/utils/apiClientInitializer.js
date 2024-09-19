const { Anthropic } = require('@anthropic-ai/sdk');
const { OpenAI } = require('openai');
const { getUserPreferencesData } = require('./userPreferencesManager');
const { ANTHROPIC_API_KEY, OPENAI_API_KEY, OLLAMA_API_URL } = require('../config/environment');

let anthropic;
let openai;
let ollamaApiUrl;

exports.initializeApiClients = async () => {
  try {
    const preferences = await getUserPreferencesData();
    const apiKeys = preferences.apiKeys || {};

    if (apiKeys.ANTHROPIC_API_KEY && apiKeys.ANTHROPIC_API_KEY !== '********') {
      anthropic = new Anthropic({ apiKey: apiKeys.ANTHROPIC_API_KEY });
    } else if (ANTHROPIC_API_KEY) {
      anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    } else {
      console.log('Valid Anthropic API key not found. Anthropic features will be disabled.');
    }

    if (apiKeys.OPENAI_API_KEY && apiKeys.OPENAI_API_KEY !== '********') {
      openai = new OpenAI({ apiKey: apiKeys.OPENAI_API_KEY });
    } else if (OPENAI_API_KEY) {
      openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    } else {
      console.log('Valid OpenAI API key not found. OpenAI features will be disabled.');
    }

    ollamaApiUrl = apiKeys.OLLAMA_API_URL || OLLAMA_API_URL;
    
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
