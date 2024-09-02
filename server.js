const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

function combineConsecutiveMessages(messages) {
  return messages.reduce((acc, msg, index) => {
    const { role, content } = msg;
    if (index === 0 || role !== acc[acc.length - 1].role) {
      acc.push({ role, content });
    } else {
      acc[acc.length - 1].content += '\n' + content;
    }
    return acc;
  }, []);
}

const app = express();
app.use(express.json());

const anthropic = new Anthropic.Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/api/models', async (req, res) => {
  try {
    // Fetch Ollama models
    const ollamaResponse = await axios.get(`${process.env.OLLAMA_API_URL}/api/tags`);
    
    // Add Anthropic models
    const anthropicModels = ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];

    // Add OpenAI models
    const openaiModels = ['gpt-3.5-turbo', 'gpt-4'];

    const allModels = [
      ...ollamaResponse.data.models,
      ...anthropicModels.map(name => ({ name })),
      ...openaiModels.map(name => ({ name }))
    ];

    res.json({ models: allModels });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models', details: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const { model, messages } = req.body;

  if (!model) {
    return res.status(400).json({ error: 'Model not specified' });
  }

  const combinedMessages = combineConsecutiveMessages(messages);

  try {
    if (model.startsWith('claude-')) {
      // Anthropic API call
      try {
        const systemMessage = combinedMessages.find(msg => msg.role === 'system');
        let userMessages = combinedMessages.filter(msg => msg.role !== 'system');
      
        const response = await anthropic.messages.create({
          model: model,
          max_tokens: 1000,
          system: systemMessage ? systemMessage.content : undefined,
          messages: userMessages,
        });
    
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
    
        const words = response.content[0].text.split(' ');
        for (const word of words) {
          res.write(`data: ${JSON.stringify({ 
            content: word + ' ',
            provider: 'anthropic'
          })}\n\n`);
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
    
        res.write(`data: ${JSON.stringify({ 
          fullContent: response.content[0].text,
          provider: 'anthropic',
          usage: response.usage
        })}\n\n`);
    
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (error) {
        console.error('Anthropic API error:', error);
        res.status(500).json({ 
          error: 'Anthropic API error', 
          message: 'An error occurred while processing your request. Please try again later.',
          details: error.message 
        });
      }
    } else if (model.startsWith('gpt-')) {
      // OpenAI API call
      const stream = await openai.chat.completions.create({
        model: model,
        messages: combinedMessages,
        stream: true,
      });

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      let fullContent = '';
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          const chunkContent = chunk.choices[0].delta.content;
          fullContent += chunkContent;
          
          res.write(`data: ${JSON.stringify({ 
            content: chunkContent,
            provider: 'openai'
          })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ 
        content: '[DONE]',
        provider: 'openai',
        fullContent: fullContent
      })}\n\n`);
      res.end();
    } else {
      // Ollama API call
      const ollamaUrl = `${process.env.OLLAMA_API_URL}/api/chat`;
      console.log('Sending request to Ollama:', ollamaUrl);
      console.log('Request payload:', JSON.stringify({ model, messages: combinedMessages, stream: true }));

      const response = await axios.post(ollamaUrl, {
        model,
        messages: combinedMessages,
        stream: true
      }, {
        responseType: 'stream'
      });

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      let fullContent = '';

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          try {
            const parsedLine = JSON.parse(line);
            if (parsedLine.message && parsedLine.message.content) {
              fullContent += parsedLine.message.content;
              res.write(`data: ${JSON.stringify({ 
                content: parsedLine.message.content,
                provider: 'ollama'
              })}\n\n`);
            }
            if (parsedLine.done) {
              res.write(`data: ${JSON.stringify({ 
                content: '[DONE]',
                provider: 'ollama',
                fullContent: fullContent
              })}\n\n`);
              res.end();
            }
          } catch (parseError) {
            console.error('Error parsing Ollama chunk:', parseError);
          }
        }
      });

      response.data.on('end', () => {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ 
            content: '[DONE]',
            provider: 'ollama',
            fullContent: fullContent
          })}\n\n`);
          res.end();
        }
      });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to call API', details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));