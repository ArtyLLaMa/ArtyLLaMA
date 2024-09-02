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

function chatWithOpenAI(messages) {
  const eventSource = new EventSource('/api/chat');

  eventSource.onmessage = function(event) {
    if (event.data === '[DONE]') {
      eventSource.close();
    } else {
      const chunk = JSON.parse(event.data);
      // Append chunk.content to your chat display
      console.log(chunk.content);
    }
  };

  eventSource.onerror = function(error) {
    console.error('EventSource failed:', error);
    eventSource.close();
  };

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: messages,
    }),
  });
}

app.post('/api/chat', async (req, res) => {
  const { model, messages } = req.body;

  // Combine consecutive messages and remove timestamps
  const combinedMessages = combineConsecutiveMessages(messages);

  try {
    if (model.startsWith('claude-')) {
      console.log('Sending request to Anthropic');
      console.log('Model:', model);
      console.log('Combined Messages:', JSON.stringify(combinedMessages));
    
      const systemMessage = combinedMessages.find(msg => msg.role === 'system');
      let userMessages = combinedMessages.filter(msg => msg.role !== 'system');
    
      try {
        console.log('Creating Anthropic message...');
        const response = await anthropic.messages.create({
          model: model,
          max_tokens: 1000,
          system: systemMessage ? systemMessage.content : undefined,
          messages: userMessages,
        });
    
        console.log('Received Anthropic response:', response);
        
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
    
        // Split the content into smaller chunks (e.g., words)
        const words = response.content[0].text.split(' ');
        for (const word of words) {
          res.write(`data: ${JSON.stringify({ 
            content: word + ' ',
            provider: 'anthropic'
          })}\n\n`);
          
          // Simulate streaming delay
          await new Promise(resolve => setTimeout(resolve, 50));
        }
    
        // Send the full content at the end
        res.write(`data: ${JSON.stringify({ 
          fullContent: response.content[0].text,
          provider: 'anthropic',
          usage: response.usage
        })}\n\n`);
    
        res.write('data: [DONE]\n\n');
        res.end();
        
        console.log('Response sent');
      } catch (anthropicError) {
        console.error('Anthropic API error:', anthropicError);
        res.status(500).json({ error: 'Anthropic API error', details: anthropicError.message });
      }
    } else if (model.startsWith('gpt-')) {
      console.log('Sending request to OpenAI');
      console.log('Model:', model);
      console.log('Combined Messages:', JSON.stringify(combinedMessages));
    
      try {
        console.log('Creating OpenAI stream...');
        const stream = await openai.chat.completions.create({
          model: model,
          messages: combinedMessages,
          stream: true,
        });
    
        console.log('Stream created, setting up response headers...');
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
    
        console.log('Starting to process stream...');
        let fullContent = '';
        for await (const chunk of stream) {
          if (chunk.choices[0]?.delta?.content) {
            const chunkContent = chunk.choices[0].delta.content;
            fullContent += chunkContent;
            console.log('Received chunk:', chunkContent);
            
            // Standardized response format for OpenAI
            res.write(`data: ${JSON.stringify({ 
              content: chunkContent,
              provider: 'openai'
            })}\n\n`);
          }
        }
    
        console.log('Stream finished, sending DONE message...');
        res.write(`data: ${JSON.stringify({ 
          content: '[DONE]',
          provider: 'openai',
          fullContent: fullContent
        })}\n\n`);
        res.end();
        console.log('Response ended');
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        if (openaiError.response) {
          console.error('OpenAI API error response:', openaiError.response.data);
        }
        res.status(500).json({ error: 'OpenAI API error', details: openaiError.message });
      }
    } else {
      // Ollama API call with improved error handling
      const ollamaUrl = `${process.env.OLLAMA_API_URL}/api/chat`;
      console.log('Sending request to Ollama:', ollamaUrl);
      console.log('Request payload:', JSON.stringify({ model, messages: combinedMessages, stream: true }));
    
      try {
        const response = await axios.post(ollamaUrl, {
          model,
          messages: combinedMessages,
          stream: true
        }, {
          responseType: 'stream'
        });
    
        console.log('Received response from Ollama');
    
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
    
        let fullContent = '';
    
        response.data.on('data', (chunk) => {
          console.log('Received chunk from Ollama:', chunk.toString());
          const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            try {
              const parsedLine = JSON.parse(line);
              console.log('Parsed Ollama chunk:', parsedLine);
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
          console.log('Ollama stream ended');
          if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ 
              content: '[DONE]',
              provider: 'ollama',
              fullContent: fullContent
            })}\n\n`);
            res.end();
          }
        });
      } catch (ollamaError) {
        console.error('Ollama API error:', ollamaError);
        if (ollamaError.response) {
          console.error('Ollama API error response:', ollamaError.response.data);
        }
        res.status(500).json({ error: 'Ollama API error', details: ollamaError.message });
      }
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to call API', details: error.message });
  }
});

app.get('/api/models', async (req, res) => {
  try {
    // Fetch Ollama models
    console.log('Fetching Ollama models from:', process.env.OLLAMA_API_URL);
    const ollamaResponse = await axios.get(`${process.env.OLLAMA_API_URL}/api/tags`);
    console.log('Ollama response:', ollamaResponse.data);

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
    console.error('Error response:', error.response?.data);
    res.status(500).json({ error: 'Failed to fetch models', details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
