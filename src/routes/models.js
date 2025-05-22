const express = require('express');
const { getModels, updateOllamaModels } = require('../controllers/modelsController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Model:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the model.
 *           example: "claude-3-opus-20240229"
 *         details:
 *           type: object
 *           description: Provider-specific details for the model (e.g., Ollama's full model object).
 *           nullable: true
 *           example:
 *             modified_at: "2023-11-05T12:34:56.789Z"
 *             size: 7365960704
 *
 *
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
 *                     $ref: '#/components/schemas/Model' # Verified: This reference is correct
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch models
 *                 details:
 *                   type: string
 *                   example: Error message from the server
 */
router.get('/', getModels);

/**
 * @swagger
 * /api/models/update-ollama:
 *   post:
 *     summary: Update Ollama models
 *     description: Triggers an update process for locally available Ollama models.
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Ollama models update process initiated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 output:
 *                   type: string
 *                   description: Output from the update script.
 *                   example: "Updating models...\nModel 'llama2' updated."
 *       500:
 *         description: Failed to update Ollama models.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update Ollama models
 *                 details:
 *                   type: string
 *                   example: Error message from the server
 */
router.post('/update-ollama', updateOllamaModels);

module.exports = router;
