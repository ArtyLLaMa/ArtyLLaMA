const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ArtyLLaMa API',
      version: '0.1.0',
      description: 'API for ArtyLLaMa, an AI-powered chat interface for interacting with open-source language models',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server (local)',
      },
      {
        url: `http://{networkIP}:${process.env.PORT || 3001}`,
        description: 'Development server (network)',
        variables: {
          networkIP: {
            default: '{networkIP}',
            description: "Your computer's IP address on the local network",
          },
        },
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };
