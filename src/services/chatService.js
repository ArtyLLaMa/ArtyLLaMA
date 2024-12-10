const { processAnthropicChat } = require('./anthropicService');
const { processOpenAIChat, generateOpenAIEmbedding } = require('./openaiService');
const { processOllamaChat, generateOllamaEmbedding } = require('./ollamaService');
const { getUserPreferences } = require('../utils/userPreferencesManager');
const chromaDBService = require('./chromaDBService');
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/sessionModel');
const Message = require('../models/messageModel');

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

    // Check if semantic search/embedding is enabled
    if (userPreferences.enableSemanticSearch === false) {
      // If disabled, skip embedding generation and storage
      return null;
    }

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

    // Use a collection per user and embedding model for isolation
    const collectionName = `chat_history_${userId}_${embeddingModel.toLowerCase()}`;

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
      embeddingDimension
    );

    return documentId;
  } catch (error) {
    console.error('Error storing message with embedding:', error);
    throw error;
  }
};

exports.getChatHistory = async (userId, sessionId) => {
  try {
    const whereClause = { userId };
    if (sessionId) {
      whereClause.sessionId = sessionId;
    }

    const messages = await Message.findAll({
      where: whereClause,
      order: [['timestamp', 'ASC']],
    });

    return messages;
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    throw error;
  }
};

exports.searchChatHistory = async (userId, query, topK = 10) => {
  try {
    const userPreferences = await getUserPreferences();

    // If semantic search is disabled, return an empty array or a message
    if (userPreferences.enableSemanticSearch === false) {
      console.log('Semantic search is disabled by user preferences.');
      return [];
    }

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

    // Use the collection corresponding to the embedding model
    const collectionName = `chat_history_${userId}_${embeddingModel.toLowerCase()}`;

    const filters = {
      userId,
    };

    const data = await chromaDBService.queryDocuments(
      collectionName,
      queryEmbedding,
      topK,
      filters,
      embeddingDimension
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
