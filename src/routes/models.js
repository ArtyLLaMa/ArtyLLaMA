const express = require('express');
const { getModels, updateOllamaModels } = require('../controllers/modelsController');

const router = express.Router();

/**
 * @swagger
 * /api/models:
 *   get:
 *     summary: Retrieve available AI models
 *     description: Fetches a list of available AI models from various providers (Ollama, Anthropic, OpenAI)
 *     tags: [Models]
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
 *                     $ref: '#/components/schemas/Model'
 *       500:
 *         description: Server error
 */
router.get('/', getModels);

/**
 * @swagger
 * /api/models/update-ollama:
 *   post:
 *     summary: Update Ollama models
 *     description: Triggers the update script for Ollama models
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 output:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/update-ollama', updateOllamaModels);

module.exports = router;
