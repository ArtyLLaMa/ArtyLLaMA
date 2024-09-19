const { getAnthropicClient } = require('../utils/apiClientInitializer');

exports.processAnthropicChat = async (model, messages, onChunk) => {
  const anthropic = getAnthropicClient();
  if (!anthropic) {
    throw new Error('Anthropic client is not initialized. Check your API key in user preferences.');
  }

  // Filter out system message and remove any unexpected fields
  const systemMessage = messages.find(msg => msg.role === 'system');
  const userMessages = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));

  const messageParams = {
    model: model,
    max_tokens: 4096,
    messages: userMessages,
    stream: true,
  };

  if (systemMessage) {
    messageParams.system = systemMessage.content;
  }

  try {
    const stream = await anthropic.messages.create(messageParams);

    for await (const event of stream) {
      switch (event.type) {
        case 'content_block_delta':
          if (event.delta.type === 'text_delta') {
            onChunk(event.delta.text, 'anthropic');
          }
          break;
        case 'message_stop':
          onChunk('[DONE]', 'anthropic');
          break;
      }
    }
  } catch (error) {
    console.error('Error in Anthropic API call:', error);
    throw error;
  }
};
