const { ArtifactManager } = require('../utils/ArtifactManager');
const { processChat } = require('../services/chatService');

const artifactManager = new ArtifactManager();

exports.chat = async (req, res) => {
  const { model, messages } = req.body;

  if (!model) {
    return res.status(400).json({ error: 'Model not specified' });
  }

  try {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    let fullContent = '';

    await processChat(model, messages, (chunk, provider) => {
      if (chunk === '[DONE]') {
        res.write(`data: ${JSON.stringify({ content: '[DONE]', provider, fullContent })}\n\n`);
        res.end();
        artifactManager.addArtifact({ type: 'chat', model, content: fullContent });
      } else {
        fullContent += chunk;
        res.write(`data: ${JSON.stringify({ content: chunk, provider })}\n\n`);
        res.flush();
      }
    });
  } catch (error) {
    console.error('Error in chat:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Chat processing error',
        message: 'An error occurred while processing your request.',
        details: error.message,
      });
    } else if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: 'Chat processing error', message: error.message })}\n\n`);
      res.end();
    }
  }
};
