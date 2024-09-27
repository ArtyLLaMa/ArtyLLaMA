const {
  processChat,
  storeMessageWithEmbedding,
  getChatHistory,
  searchChatHistory,
} = require("../services/chatService");
const { ArtifactManager } = require("../utils/ArtifactManager");

const artifactManager = new ArtifactManager();

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
    const currentSessionId = sessionId || "default_session";

    const lastUserMessage = messages[messages.length - 1];
    await storeMessageWithEmbedding(
      userId,
      currentSessionId,
      lastUserMessage.content,
      lastUserMessage.role
    );

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

        await storeMessageWithEmbedding(
          userId,
          currentSessionId,
          fullContent,
          "assistant"
        );

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
