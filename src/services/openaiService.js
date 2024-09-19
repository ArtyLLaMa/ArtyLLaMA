const { OpenAI } = require('openai');
const { OPENAI_API_KEY } = require('../config/environment');

let openai;

if (OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
}

exports.processOpenAIChat = async (model, messages, onChunk) => {
  if (!openai) {
    throw new Error('OpenAI API key is not configured.');
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
