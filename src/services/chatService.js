const { processAnthropicChat } = require('./anthropicService');
const { processOpenAIChat, generateOpenAIEmbedding } = require('./openaiService');
const { processOllamaChat, generateOllamaEmbedding } = require('./ollamaService');
const { getUserPreferences } = require('../utils/userPreferencesManager');
const chromaDBService = require('./chromaDBService');
const { v4: uuidv4 } = require('uuid');

exports.processChat = async (model, messages, onChunk) => {
  try {
    const userPreferences = await getUserPreferences();
    const systemMessage =
      userPreferences.lastUsedSystemMessage ||
      'You are Arty, a helpful assistant, now with embedding!';

    const cleanedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (!cleanedMessages.some((msg) => msg.role === 'system')) {
      cleanedMessages.unshift({ role: 'system', content: systemMessage });
    }

    if (model.startsWith('claude-')) {
      await processAnthropicChat(model, cleanedMessages, onChunk);
    } else if (model.startsWith('gpt-')) {
      await processOpenAIChat(model, cleanedMessages, onChunk);
    } else {
      await processOllamaChat(model, cleanedMessages, onChunk);
    }
  } catch (error) {
    console.error('Error in processChat:', error);
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
    const userPreferences = await getUserPreferences();
    const embeddingModel = userPreferences.embeddingModel || 'OpenAI';

    let embedding = null;
    let embeddingDimension = null;

    if (embeddingModel === 'OpenAI') {
      embedding = await generateOpenAIEmbedding(messageContent);
      embeddingDimension = 1536; // OpenAI embedding dimension
    } else if (embeddingModel === 'Ollama') {
      embedding = await generateOllamaEmbedding(messageContent);
      embeddingDimension = 1024; // Ollama embedding dimension
    } else {
      throw new Error(`Unsupported embedding model: ${embeddingModel}`);
    }

    // Include embedding dimension in the collection name
    const collectionName = `chat_history_${embeddingDimension}`;

    const documentId = uuidv4();
    const metadata = {
      userId,
      sessionId,
      role,
      timestamp: new Date().toISOString(),
      bookmarked: false,
    };

    await chromaDBService.addDocument(
      collectionName,
      documentId,
      messageContent,
      embedding,
      metadata,
      embeddingDimension // Pass embedding dimension
    );

    return documentId;
  } catch (error) {
    console.error('Error storing message with embedding:', error);
    throw error;
  }
};

exports.getChatHistory = async (userId, sessionId) => {
  try {
    const userPreferences = await getUserPreferences();
    const embeddingModel = userPreferences.embeddingModel || 'OpenAI';

    let embeddingDimension = null;

    if (embeddingModel === 'OpenAI') {
      embeddingDimension = 1536;
    } else if (embeddingModel === 'Ollama') {
      embeddingDimension = 1024;
    } else {
      throw new Error(`Unsupported embedding model: ${embeddingModel}`);
    }

    // Include embedding dimension in the collection name
    const collectionName = `chat_history_${embeddingDimension}`;

    const filters = { userId };
    if (sessionId) {
      filters.sessionId = sessionId;
    }

    const data = await chromaDBService.getDocuments(
      collectionName,
      filters,
      embeddingDimension
    );

    const messages = data.documents.map((content, index) => ({
      id: data.ids[index],
      content,
      timestamp: data.metadatas[index]?.timestamp || new Date().toISOString(),
      bookmarked: data.metadatas[index]?.bookmarked || false,
      sessionId: data.metadatas[index]?.sessionId || null,
      role: data.metadatas[index]?.role || 'user',
    }));

    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return messages;
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    throw error;
  }
};

exports.searchChatHistory = async (userId, query, topK = 10) => {
  try {
    const userPreferences = await getUserPreferences();
    const embeddingModel = userPreferences.embeddingModel || 'OpenAI';

    let queryEmbedding = null;
    let embeddingDimension = null;

    if (embeddingModel === 'OpenAI') {
      queryEmbedding = await generateOpenAIEmbedding(query);
      embeddingDimension = 1536;
    } else if (embeddingModel === 'Ollama') {
      queryEmbedding = await generateOllamaEmbedding(query);
      embeddingDimension = 1024;
    } else {
      throw new Error(`Unsupported embedding model: ${embeddingModel}`);
    }

    // Include embedding dimension in the collection name
    const collectionName = `chat_history_${embeddingDimension}`;

    const filters = { userId };

    const data = await chromaDBService.queryDocuments(
      collectionName,
      queryEmbedding,
      topK,
      filters,
      embeddingDimension // Pass embedding dimension
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
      role: metadatas[index]?.role || 'user',
    }));

    return results;
  } catch (error) {
    console.error('Error searching chat history:', error);
    throw error;
  }
};
