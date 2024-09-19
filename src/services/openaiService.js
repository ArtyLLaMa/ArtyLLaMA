const { getOpenAIClient } = require('../utils/apiClientInitializer');

exports.processOpenAIChat = async (model, messages, onChunk) => {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error('OpenAI client is not initialized. Check your API key in user preferences.');
  }

  const completion = await openai.chat.completions.create({
    model: model,
    messages: messages,
    max_tokens: 4096,
    stream: true,
  });

  for await (const part of completion) {
    if (part.choices[0]?.delta?.content) {
      onChunk(part.choices[0].delta.content, 'openai');
    }
  }

  onChunk('[DONE]', 'openai');
};
