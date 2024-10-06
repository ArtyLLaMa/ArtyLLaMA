const Session = require("../models/sessionModel");
const Message = require("../models/messageModel");
const {
  processChat,
  storeMessageWithEmbedding,
  getChatHistory,
  searchChatHistory,
} = require("../services/chatService");
const { ArtifactManager } = require("../utils/ArtifactManager");

const artifactManager = new ArtifactManager();

exports.createSession = async (req, res) => {
  const userId = req.user.id;
  try {
    const session = await Session.create({ userId });
    res.status(201).json({ session });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session." });
  }
};

exports.getSessions = async (req, res) => {
  const userId = req.user.id;
  try {
    const sessions = await Session.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions." });
  }
};

exports.getSessionMessages = async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;
  try {
    const session = await Session.findOne({ where: { id: sessionId, userId } });
    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    const messages = await Message.findAll({
      where: { sessionId },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};

exports.addMessage = async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;
  const { content, role } = req.body;

  try {
    const session = await Session.findOne({ where: { id: sessionId, userId } });
    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    const message = await Message.create({
      sessionId,
      userId,
      content,
      role,
    });

    // Store embedding (optional)
    await storeMessageWithEmbedding(userId, sessionId, content, role);

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ error: "Failed to add message." });
  }
};

exports.chat = async (req, res) => {
  const { model, messages, sessionId } = req.body;

  if (!model) {
    return res.status(400).json({ error: "Model not specified" });
  }

  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    let fullContent = "";
    const userId = req.user.id;

    // Ensure session exists
    let session = await Session.findOne({ where: { id: sessionId, userId } });
    if (!session) {
      session = await Session.create({ userId });
    }

    const lastUserMessage = messages[messages.length - 1];

    // Save user's message
    const userMessage = await Message.create({
      sessionId: session.id,
      userId,
      content: lastUserMessage.content,
      role: "user",
    });

    // Store embedding
    await storeMessageWithEmbedding(userId, session.id, lastUserMessage.content, "user");

    await processChat(model, messages, async (chunk, provider) => {
      if (chunk === "[DONE]") {
        res.write(
          `data: ${JSON.stringify({
            content: "[DONE]",
            provider,
            fullContent,
          })}\n\n`
        );
        res.end();

        // Save assistant's reply
        const assistantMessage = await Message.create({
          sessionId: session.id,
          userId,
          content: fullContent,
          role: "assistant",
        });

        // Store embedding
        await storeMessageWithEmbedding(userId, session.id, fullContent, "assistant");

        artifactManager.addArtifact({
          type: "chat",
          model,
          content: fullContent,
        });
      } else {
        fullContent += chunk;
        res.write(`data: ${JSON.stringify({ content: chunk, provider })}\n\n`);
        res.flush();
      }
    });
  } catch (error) {
    console.error("Error in chat:", error);
    const errorMessage = error.message || "An unexpected error occurred";
    if (!res.headersSent) {
      res.status(500).json({
        error: "Chat processing error",
        message: errorMessage,
        details: error.toString(),
      });
    } else if (!res.writableEnded) {
      res.write(
        `data: ${JSON.stringify({
          error: "Chat processing error",
          message: errorMessage,
        })}\n\n`
      );
      res.end();
    }
  }
};

exports.semanticSearch = async (req, res) => {
  const userId = req.user.id;
  const { query, topK } = req.body;
  try {
    const results = await searchChatHistory(userId, query, topK);
    res.status(200).json({ results });
  } catch (error) {
    console.error("Error performing semantic search:", error);
    res.status(500).json({ error: "Semantic search failed." });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.query.sessionId || null;

    const messages = await getChatHistory(userId, sessionId);

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.searchChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query, topK } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Missing query field" });
    }

    const results = await searchChatHistory(userId, query, topK);

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error searching chat history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

