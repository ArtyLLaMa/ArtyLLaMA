const express = require("express");
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
router.post("/sessions", authenticate, createSession);
router.get("/sessions", authenticate, getSessions);
router.get("/sessions/:sessionId/messages", authenticate, getSessionMessages);
router.post("/sessions/:sessionId/messages", authenticate, addMessage);

// Chat and search routes
router.post("/", authenticate, chat);
router.get("/history", authenticate, getChatHistory);
router.post("/semantic-search", authenticate, searchChatHistory);

module.exports = router;
