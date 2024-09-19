const express = require('express');
const { chat } = require('../controllers/chatController');

const router = express.Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a chat message
 *     description: Send a message to the selected AI model and receive a streaming response
 *     tags: [Chat]
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
 *                       enum: [system, user, assistant]
 *                     content:
 *                       type: string
 *               max_tokens:
 *                 type: integer
 *               temperature:
 *                 type: number
 *               stream:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                 provider:
 *                   type: string
 *                   enum: [anthropic, openai, ollama]
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', chat);

module.exports = router;
