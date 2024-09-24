const { processAnthropicChat } = require("./anthropicService");
const { processOpenAIChat, generateEmbedding } = require("./openaiService");
const { processOllamaChat } = require("./ollamaService");
const { getUserPreferences } = require("../utils/userPreferencesManager");
const chromaDBService = require("./chromaDBService");
const { v4: uuidv4 } = require("uuid");

exports.processChat = async (model, messages, onChunk) => {
  try {
    const userPreferences = await getUserPreferences();
    const systemMessage =
      userPreferences.lastUsedSystemMessage ||
      "You are Arty, a helpful assistant, now with embedding!";

    const cleanedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (!cleanedMessages.some((msg) => msg.role === "system")) {
      cleanedMessages.unshift({ role: "system", content: systemMessage });
    }

    if (model.startsWith("claude-")) {
      await processAnthropicChat(model, cleanedMessages, onChunk);
    } else if (model.startsWith("gpt-")) {
      await processOpenAIChat(model, cleanedMessages, onChunk);
    } else {
      await processOllamaChat(model, cleanedMessages, onChunk);
    }
  } catch (error) {
    console.error("Error in processChat:", error);
    throw error;
  }
};

exports.storeMessageWithEmbedding = async (
  userId,
  sessionId,
  messageContent,
  role
) => {
  try {
    const embedding = await generateEmbedding(messageContent);
    const documentId = uuidv4();
    const metadata = {
      userId,
      sessionId,
      role,
      timestamp: new Date().toISOString(),
      bookmarked: false,
    };

    await chromaDBService.addDocument(
      "chat_history",
      documentId,
      messageContent,
      embedding,
      metadata
    );

    return documentId;
  } catch (error) {
    console.error("Error storing message with embedding:", error);
    throw error;
  }
};

exports.getChatHistory = async (userId, sessionId) => {
  try {
    const filters = { userId };
    if (sessionId) {
      filters.sessionId = sessionId;
    }

    const data = await chromaDBService.getDocuments("chat_history", filters);

    const messages = data.documents.map((content, index) => ({
      id: data.ids[index],
      content,
      timestamp: data.metadatas[index]?.timestamp || new Date().toISOString(),
      bookmarked: data.metadatas[index]?.bookmarked || false,
      sessionId: data.metadatas[index]?.sessionId || null,
      role: data.metadatas[index]?.role || "user",
    }));

    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return messages;
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    throw error;
  }
};

exports.searchChatHistory = async (userId, query, topK = 10) => {
  try {
    const queryEmbedding = await generateEmbedding(query);
    const filters = { userId };

    const data = await chromaDBService.queryDocuments(
      "chat_history",
      queryEmbedding,
      topK,
      filters
    );

    const documents = data.documents[0];
    const metadatas = data.metadatas[0];
    const distances = data.distances[0];

    const results = documents.map((content, index) => ({
      content,
      distance: distances[index],
      id: data.ids[0][index],
      timestamp: metadatas[index]?.timestamp || new Date().toISOString(),
      bookmarked: metadatas[index]?.bookmarked || false,
      sessionId: metadatas[index]?.sessionId || null,
      role: metadatas[index]?.role || "user",
    }));

    return results;
  } catch (error) {
    console.error("Error searching chat history:", error);
    throw error;
  }
};
