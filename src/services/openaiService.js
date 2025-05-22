require('dotenv').config();
const axios = require('axios');
const { OPENAI_API_KEY } = process.env;

if (!OPENAI_API_KEY) {
  throw new Error(
    'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.'
  );
}

const OPENAI_API_URL = 'https://api.openai.com/v1';

exports.processOpenAIChat = async (model, messages, onChunk) => {
  try {
    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model,
        messages,
        stream: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        responseType: 'stream',
      }
    );

    response.data.on('data', (chunk) => {
      const lines = chunk
        .toString('utf8')
        .split('\n')
        .filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const messageData = line.replace(/^data: /, '').trim();
          if (messageData === '[DONE]') {
            onChunk('[DONE]', 'openai');
            return;
          }
          try {
            const parsed = JSON.parse(messageData);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              onChunk(content, 'openai');
            }
          } catch (error) {
            console.error('Error parsing OpenAI chat chunk:', error);
          }
        }
      }
    });

    response.data.on('end', () => {
      onChunk('[DONE]', 'openai');
    });

    response.data.on('error', (error) => {
      console.error('OpenAI stream error:', error);
      onChunk('[ERROR]', 'openai');
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

exports.generateOpenAIEmbedding = async (text) => {
  try {
    console.log('Generating OpenAI embedding for text:', text);

    const response = await axios.post(
      `${OPENAI_API_URL}/embeddings`,
      {
        input: text,
        model: 'text-embedding-3-small', // Use your preferred embedding model here
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    console.log('OpenAI Embedding Response:', response.data);

    if (
      response.data &&
      response.data.data &&
      response.data.data.length > 0 &&
      response.data.data[0].embedding
    ) {
      return response.data.data[0].embedding;
    } else {
      console.error('Unexpected embedding response format:', response.data);
      throw new Error('Failed to generate embedding: Unexpected response format');
    }
  } catch (error) {
    if (error.response) {
      console.error('OpenAI API Error:', error.response.status, error.response.data);
      throw new Error(
        `OpenAI API Error: ${error.response.status} ${error.response.data.error.message}`
      );
    } else {
      console.error('Error generating embedding:', error.message);
      throw error;
    }
  }
};

exports.generateTitleWithOpenAI = async (text) => {
  try {
    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: "gpt-3.5-turbo", // Or your preferred model for title generation
        messages: [
          {
            role: "system",
            content: "You are an assistant that generates concise and relevant chat titles. The title should be 5 words or less.",
          },
          {
            role: "user",
            content: `Generate a title for the following text: "${text}"`,
          },
        ],
        max_tokens: 20, // Adjust as needed for title length
        temperature: 0.5, // Adjust for creativity vs. determinism
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      let title = response.data.choices[0].message.content.trim();
      // Remove quotes if the model adds them
      title = title.replace(/^["'](.*)["']$/, '$1');
      return title;
    } else {
      console.error("Unexpected title generation response format:", response.data);
      throw new Error("Failed to generate title: Unexpected response format");
    }
  } catch (error) {
    console.error("Error generating title with OpenAI:", error.response ? error.response.data : error.message);
    throw error;
  }
};
