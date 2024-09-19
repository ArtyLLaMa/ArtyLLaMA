const { processAnthropicChat } = require('./anthropicService');
const { processOpenAIChat } = require('./openaiService');
const { processOllamaChat } = require('./ollamaService');

exports.processChat = async (model, messages, onChunk) => {
  if (model.startsWith('claude-')) {
    await processAnthropicChat(model, messages, onChunk);
  } else if (model.startsWith('gpt-')) {
    await processOpenAIChat(model, messages, onChunk);
  } else {
    await processOllamaChat(model, messages, onChunk);
  }
};
