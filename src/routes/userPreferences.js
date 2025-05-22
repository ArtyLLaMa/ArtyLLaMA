const express = require('express');
const { getUserPreferences, saveUserPreferences } = require('../controllers/userPreferencesController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreferences:
 *       type: object
 *       properties:
 *         savedMessages:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of saved messages or prompts.
 *           example: ["Remember to greet the user.", "What are the latest AI advancements?"]
 *         lastUsedModel:
 *           type: string
 *           description: The identifier of the last used AI model.
 *           example: "claude-3-sonnet-20240229"
 *         lastUsedSystemMessage:
 *           type: string
 *           description: The last system message used in chats.
 *           example: "You are a helpful AI assistant."
 *         apiKeys:
 *           type: object
 *           description: API keys for various AI model providers.
 *           properties:
 *             OLLAMA_API_URL:
 *               type: string
 *               description: The API URL for Ollama (if applicable).
 *               example: "http://localhost:11434"
 *             ANTHROPIC_API_KEY:
 *               type: string
 *               description: The API key for Anthropic (if applicable).
 *             OPENAI_API_KEY:
 *               type: string
 *               description: The API key for OpenAI (if applicable).
 *         embeddingModel:
 *           type: string
 *           description: The model used for generating embeddings for semantic search.
 *           example: "OpenAI"
 *         enableSemanticSearch:
 *           type: boolean
 *           description: Flag to enable or disable semantic search functionality.
 *           example: true
 *
 *
 * /api/user-preferences:
 *   get:
 *     summary: Get user preferences
 *     description: Retrieves the user preferences from the server
 *     tags: [User Preferences]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferences' # Verified: This reference is correct
 *       500:
 *         description: Server error retrieving user preferences.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to retrieve user preferences
 */
router.get('/', getUserPreferences);

/**
 * @swagger
 * /api/user-preferences:
 *   post:
 *     summary: Save user preferences
 *     description: Saves the user preferences to the server
 *     tags: [User Preferences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/UserPreferences' # Verified: This reference is correct
 *     responses:
 *       200:
 *         description: User preferences saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User preferences saved successfully
 *       500:
 *         description: Server error saving user preferences.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to save user preferences
 */
router.post('/', saveUserPreferences);

module.exports = router;
