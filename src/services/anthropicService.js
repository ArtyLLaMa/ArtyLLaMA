const Anthropic = require('@anthropic-ai/sdk');
const { ANTHROPIC_API_KEY } = require('../config/environment');

let anthropic;

if (ANTHROPIC_API_KEY) {
  anthropic = new Anthropic.Anthropic({ apiKey: ANTHROPIC_API_KEY });
}

exports.processAnthropicChat = async (model, messages, onChunk) => {
  if (!anthropic) {
    throw new Error('Anthropic API key is not configured.');
  }

  const systemMessage = messages.find(msg => msg.role === 'system');
  const userMessages = messages.filter(msg => msg.role !== 'system');

  const messageParams = {
    model: model,
    max_tokens: 4096,
    messages: userMessages,
    stream: true,
  };

  if (systemMessage) {
    messageParams.system = systemMessage.content;
  }

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
};
