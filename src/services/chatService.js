const { processAnthropicChat } = require('./anthropicService');
const { processOpenAIChat, generateOpenAIEmbedding } = require('./openaiService');
const { processOllamaChat, generateOllamaEmbedding } = require('./ollamaService');
const { getUserPreferences } = require('../utils/userPreferencesManager');
const chromaDBService = require('./chromaDBService');
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/sessionModel');
const Message = require('../models/messageModel');

/**
 * Helper function to generate embeddings and determine embedding dimensions.
 * This function abstracts the logic for choosing the embedding provider (OpenAI or Ollama)
 * and retrieving the correct embedding vector and its dimension.
 *
 * @param {string} text - The input text to generate embeddings for.
 * @param {string} embeddingModelName - The name of the embedding model to use ('OpenAI' or 'Ollama').
 * @returns {Promise<{embedding: Array<number>|null, embeddingDimension: number|null}>} 
 *          An object containing the generated embedding and its dimension.
 * @throws {Error} If the embeddingModelName is not supported.
 */
async function getEmbeddingDetails(text, embeddingModelName) {
  let embedding = null;
  let embeddingDimension = null;

  if (embeddingModelName === 'OpenAI') {
    embedding = await generateOpenAIEmbedding(text);
    embeddingDimension = 1536; // OpenAI embedding dimension
  } else if (embeddingModelName === 'Ollama') {
    embedding = await generateOllamaEmbedding(text);
    // Note: Ollama embedding dimension can vary based on the model.
    // This might need to be dynamically determined or configured if more models are supported.
    embeddingDimension = 1024; // Assuming a common Ollama embedding dimension
  } else {
    throw new Error(`Unsupported embedding model: ${embeddingModelName}`);
  }
  return { embedding, embeddingDimension };
}

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

    const embeddingModelName = userPreferences.embeddingModel || 'OpenAI';

    // Retrieve embedding and its dimension using the helper function.
    const { embedding, embeddingDimension } = await getEmbeddingDetails(
      messageContent,
      embeddingModelName
    );

    // Use a collection per user and embedding model for isolation
    const collectionName = `chat_history_${userId}_${embeddingModelName.toLowerCase()}`;

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

    const embeddingModelName = userPreferences.embeddingModel || 'OpenAI';

    // Retrieve query embedding and its dimension using the helper function.
    const { embedding: queryEmbedding, embeddingDimension } =
      await getEmbeddingDetails(query, embeddingModelName);

    // Use the collection corresponding to the embedding model
    const collectionName = `chat_history_${userId}_${embeddingModelName.toLowerCase()}`;

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
