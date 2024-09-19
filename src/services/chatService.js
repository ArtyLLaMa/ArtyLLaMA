const { processAnthropicChat } = require('./anthropicService');
const { processOpenAIChat } = require('./openaiService');
const { processOllamaChat } = require('./ollamaService');
const { getUserPreferences } = require('../utils/userPreferencesManager');

exports.processChat = async (model, messages, onChunk) => {
  try {
    const userPreferences = await getUserPreferences();
    const systemMessage = userPreferences.lastUsedSystemMessage || 'You are a helpful AI assistant.';

    // Ensure messages only contain expected fields
    const cleanedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    if (!cleanedMessages.some(msg => msg.role === 'system')) {
      cleanedMessages.unshift({ role: 'system', content: systemMessage });
    }

    if (model.startsWith('claude-')) {
      await processAnthropicChat(model, cleanedMessages, onChunk);
    } else if (model.startsWith('gpt-')) {
      await processOpenAIChat(model, cleanedMessages, onChunk);
    } else {
      await processOllamaChat(model, cleanedMessages, onChunk);
    }
  } catch (error) {
    console.error('Error in processChat:', error);
    throw error;
  }
};
