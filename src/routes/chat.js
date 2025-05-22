const express = require("express");

/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the session.
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who owns the session.
 *           example: "b2c3d4e5-f6g7-8901-2345-67890abcdef0"
 *         title:
 *           type: string
 *           nullable: true
 *           description: An optional title for the session.
 *           example: "My First Chat"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the session was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the session was last updated.
 *       required:
 *         - id
 *         - userId
 *         - createdAt
 *         - updatedAt
 *
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the message.
 *           example: "c3d4e5f6-g7h8-9012-3456-7890abcdef01"
 *         sessionId:
 *           type: string
 *           format: uuid
 *           description: The ID of the session this message belongs to.
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who sent the message.
 *           example: "b2c3d4e5-f6g7-8901-2345-67890abcdef0"
 *         role:
 *           type: string
 *           enum: [user, assistant]
 *           description: The role of the message sender.
 *           example: "user"
 *         content:
 *           type: string
 *           description: The content of the message.
 *           example: "Hello, how are you?"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message was recorded.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message record was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message record was last updated.
 *       required:
 *         - id
 *         - sessionId
 *         - userId
 *         - role
 *         - content
 *         - timestamp
 *         - createdAt
 *         - updatedAt
 *
 *     ChatMessageInput:
 *       type: object
 *       properties:
 *         model:
 *           type: string
 *           description: The model to use for the chat.
 *           example: "gpt-3.5-turbo"
 *         messages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, assistant]
 *                 description: The role of the message sender.
 *               content:
 *                 type: string
 *                 description: The content of the message.
 *             required:
 *               - role
 *               - content
 *           description: Array of message objects for context.
 *         sessionId:
 *           type: string
 *           format: uuid
 *           description: ID of the session for context.
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *       required:
 *         - model
 *         - messages
 *         - sessionId
 *
 *     ChatStreamEvent:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: A chunk of the chat response or '[DONE]' signal.
 *         provider:
 *           type: string
 *           description: The provider of the chat model.
 *           example: "openai"
 *         fullContent:
 *           type: string
 *           description: The full accumulated content (only present when content is '[DONE]').
 *           nullable: true
 *
 *     NewMessageBody:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the message.
 *           example: "What is the capital of France?"
 *         role:
 *           type: string
 *           enum: [user, assistant]
 *           description: The role of the message sender. Typically 'user' for this endpoint.
 *           example: "user"
 *       required:
 *         - content
 *         - role
 *
 *     SemanticSearchQuery:
 *       type: object
 *       properties:
 *         query:
 *           type: string
 *           description: The search query.
 *           example: "information about LLMs"
 *         topK:
 *           type: integer
 *           description: The number of results to return.
 *           example: 5
 *           nullable: true
 *       required:
 *         - query
 *
 *     SemanticSearchResult:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Message'
 *       description: An array of message objects matching the semantic search query.
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const {
  chat,
  getChatHistory,
  searchChatHistory,
  createSession,
  getSessions,
  getSessionMessages,
  addMessage,
} = require("../controllers/chatController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Session management routes

/**
 * @swagger
 * /api/chat/sessions:
 *   post:
 *     summary: Create a new chat session.
 *     description: Creates a new chat session for the authenticated user.
 *     tags: [Chat Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Session created successfully. Returns the new session object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   $ref: '#/components/schemas/Session'
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Failed to create session.
 */
router.post("/sessions", authenticate, createSession);

/**
 * @swagger
 * /api/chat/sessions:
 *   get:
 *     summary: Get all chat sessions for the authenticated user.
 *     description: Retrieves a list of all chat sessions associated with the authenticated user, ordered by creation date (descending).
 *     tags: [Chat Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of sessions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Failed to fetch sessions.
 */
router.get("/sessions", authenticate, getSessions);

/**
 * @swagger
 * /api/chat/sessions/{sessionId}/messages:
 *   get:
 *     summary: Get all messages for a specific chat session.
 *     description: Retrieves all messages within a specific chat session, ordered by creation date (ascending). The user must own the session.
 *     tags: [Chat Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the session to retrieve messages from.
 *     responses:
 *       '200':
 *         description: A list of messages for the session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Session not found.
 *       '500':
 *         description: Failed to fetch messages.
 */
router.get("/sessions/:sessionId/messages", authenticate, getSessionMessages);

/**
 * @swagger
 * /api/chat/sessions/{sessionId}/messages:
 *   post:
 *     summary: Add a new message to a specific chat session.
 *     description: Adds a new message to an existing chat session. The user must own the session.
 *     tags: [Chat Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the session to add the message to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewMessageBody'
 *     responses:
 *       '201':
 *         description: Message added successfully. Returns the new message object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: '#/components/schemas/Message'
 *       '400':
 *         description: Bad request (e.g., missing content or role).
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Session not found.
 *       '500':
 *         description: Failed to add message.
 */
router.post("/sessions/:sessionId/messages", authenticate, addMessage);

// Chat and search routes

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a message to the chat model and get a streamed response.
 *     description: Sends a message sequence to the specified AI model and streams the response back. A session ID must be provided. If the session doesn't exist, it will be created. User messages are saved to the database.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessageInput'
 *     responses:
 *       '200':
 *         description: Successful streaming response. The Content-Type will be text/event-stream.
 *         content:
 *           text/event-stream:
 *             schema:
 *               $ref: '#/components/schemas/ChatStreamEvent'
 *             example: |
 *               data: {"content": "Hello", "provider": "openai"}
 *
 *               data: {"content": " there!", "provider": "openai"}
 *
 *               data: {"content": "[DONE]", "provider": "openai", "fullContent": "Hello there!"}
 *       '400':
 *         description: Model not specified or other bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Model not specified"
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Chat processing error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Chat processing error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.post("/", authenticate, chat);

/**
 * @swagger
 * /api/chat/history:
 *   get:
 *     summary: Get chat history for the user, optionally filtered by session.
 *     description: Retrieves chat messages for the authenticated user. Can be filtered by a specific session ID.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Optional ID of the session to filter history. If not provided, history for all sessions may be returned (behavior depends on controller logic - assuming it means all messages for the user across sessions if not specified, or specific session if provided).
 *     responses:
 *       '200':
 *         description: A list of chat messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal server error.
 */
router.get("/history", authenticate, getChatHistory);

/**
 * @swagger
 * /api/chat/semantic-search:
 *   post:
 *     summary: Perform a semantic search on the chat history.
 *     description: Searches the authenticated user's chat history based on semantic similarity to the provided query.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemanticSearchQuery'
 *     responses:
 *       '200':
 *         description: Semantic search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   $ref: '#/components/schemas/SemanticSearchResult'
 *       '400':
 *         description: Missing query field.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing query field"
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Semantic search failed or Internal server error.
 */
router.post("/semantic-search", authenticate, searchChatHistory);

module.exports = router;
