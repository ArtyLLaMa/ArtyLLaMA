/* Will have to update that file for Swagger documentation */
const express = require("express");
const {
  chat,
  getChatHistory,
  searchChatHistory,
} = require("../controllers/chatController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/**
 * POST /api/chat
 * Send a chat message
 */
router.post("/", authenticate, chat);

/**
 * GET /api/chat/history
 * Retrieve chat history
 */
router.get("/history", authenticate, getChatHistory);

/**
 * POST /api/chat/search
 * Search chat history
 */
router.post("/search", authenticate, searchChatHistory);

module.exports = router;
