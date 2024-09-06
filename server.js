const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const ArtifactManager = require('./src/utils/ArtifactManager');
const fs = require('fs').promises;
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const USER_PREFERENCES_FILE = path.join(__dirname, 'user_preferences.json');

dotenv.config();

(async function() {
  const { default: chalk } = await import('chalk');

  console.log(chalk.blue(`
                    .+%%*:            .*%%*.                    
                   .@@#+@@-          :@@**@@.                   
                   *@%  +@@    ..    %@*  %@#                   
                   %@+  .@@*#@@@@@@#*@@:  +@@                   
                   %@+  .@@@*-:...-*@@@:  +@@                   
                   #@@@@@@#.         *@@@@@@%                   
                 :%@@+-:::            :::-+%@%-                 
                =@@=                        =@@=                
               .@@=                          -@@:               
               =@@    :+=   -+*##*+-   =+-    @@=               
               -@@:   %@@.+@*-....-*@+.%@@   .@@-               
                #@%:   . +@:  :##:  :@+ .   :%@#                
                :@@*     +@:   ++   .@*     *@@:                
                %@#       +@#=----=*@+       *@%                
               .@@-         :======:         :@@:               
               :@@:                          :@@:               
                @@*                          +@@                
                :@@*                        *@@:                
                .@@*                        +@@.                
                *@%                          %@*                
                %@*                          +@%                
                *%#                          *%#
                     Welcome to ArtyLLaMa!
  Report bugs to https://github.com/kroonen/ArtyLLaMa/issues
  `));

  console.log(chalk.cyan('ArtyLLaMa Server Starting...'));

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

  const artifactManager = new ArtifactManager();

  // Swagger definition
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ArtyLLaMa API',
        version: '1.0.0',
        description: 'API for ArtyLLaMa, an AI-powered chat interface for interacting with open-source language models',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3001}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./server.js'], // Path to the API docs
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @swagger
   * /api/models:
   *   get:
   *     summary: Retrieve available AI models
   *     description: Fetches a list of available AI models from various providers
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 models:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *       500:
   *         description: Server error
   */
  app.get('/api/models', async (req, res) => {
    try {
      // Fetch Ollama models
      const ollamaResponse = await axios.get(`${process.env.OLLAMA_API_URL}/api/tags`);
      
      // Add Anthropic models
      const anthropicModels = ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];

      // Add OpenAI models
      const openaiModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'];

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

  /**
   * @swagger
   * /api/chat:
   *   post:
   *     summary: Send a chat message
   *     description: Send a message to the selected AI model and receive a response
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - model
   *               - messages
   *             properties:
   *               model:
   *                 type: string
   *               messages:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     role:
   *                       type: string
   *                     content:
   *                       type: string
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           text/event-stream:
   *             schema:
   *               type: string
   *       400:
   *         description: Bad request
   *       500:
   *         description: Server error
   */
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
            max_tokens: 4096,
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

          artifactManager.addArtifact({
            type: 'chat',
            model: model,
            content: response.content[0].text
          });
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
        try {
          const stream = await openai.chat.completions.create({
            model: model,
            messages: combinedMessages,
            max_tokens: 4096,
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

          artifactManager.addArtifact({
            type: 'chat',
            model: model,
            content: fullContent
          });
        } catch (error) {
          console.error('OpenAI API error:', error);
          res.status(500).json({ 
            error: 'OpenAI API error', 
            message: 'An error occurred while processing your request. Please try again later.',
            details: error.message 
          });
        }
      } else {
        // Ollama API call
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

                  artifactManager.addArtifact({
                    type: 'chat',
                    model: model,
                    content: fullContent
                  });
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

              artifactManager.addArtifact({
                type: 'chat',
                model: model,
                content: fullContent
              });
            }
          });
        } catch (error) {
          console.error('Ollama API error:', error);
          res.status(500).json({ 
            error: 'Ollama API error', 
            message: 'An error occurred while processing your request. Please try again later.',
            details: error.message 
          });
        }
      }
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({ error: 'Failed to call API', details: error.message });
    }
  });

  /**
   * @swagger
   * /api/user-preferences:
   *   get:
   *     summary: Get user preferences
   *     description: Retrieves the user preferences from the server
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       500:
   *         description: Server error
   */
  app.get('/api/user-preferences', async (req, res) => {
    try {
      const data = await fs.readFile(USER_PREFERENCES_FILE, 'utf8');
      res.json(JSON.parse(data));
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty preferences
        res.json({});
      } else {
        console.error('Error reading user preferences:', error);
        res.status(500).json({ error: 'Failed to read user preferences' });
      }
    }
  });
  
  /**
   * @swagger
   * /api/user-preferences:
   *   post:
   *     summary: Save user preferences
   *     description: Saves the user preferences to the server
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       500:
   *         description: Server error
   */
  app.post('/api/user-preferences', async (req, res) => {
    try {
      await fs.writeFile(USER_PREFERENCES_FILE, JSON.stringify(req.body, null, 2));
      res.json({ message: 'User preferences saved successfully' });
    } catch (error) {
      console.error('Error saving user preferences:', error);
      res.status(500).json({ error: 'Failed to save user preferences' });
    }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(chalk.green(`Server running on port ${PORT}`));
    console.log(chalk.blue(`Swagger UI available at http://localhost:${PORT}/api-docs`));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(chalk.red('Error:'), err);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'An unexpected error occurred. Please try again later.'
    });
  });

  process.on('exit', () => {
    console.log(chalk.yellow('Generating session summary...'));
    artifactManager.generateSessionSummary();
    console.log(chalk.green('Session summary generated. Goodbye!'));
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
    // Application specific logging, throwing an error, or other logic here
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error(chalk.red('Uncaught Exception:'), error);
    // Application specific logging, throwing an error, or other logic here
    process.exit(1); // Exit with failure
  });
})();
