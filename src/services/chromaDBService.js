const axios = require("axios");

const CHROMA_DB_API_URL =
  process.env.CHROMA_DB_API_URL || "http://localhost:8000";

let collectionIdCache = {};

const ensureCollectionExists = async (collectionName, embeddingDimension) => {
  if (collectionIdCache[collectionName]) {
    return collectionIdCache[collectionName];
  }
  try {
    const response = await axios.get(`${CHROMA_DB_API_URL}/api/v1/collections`);
    const collections = response.data;

    // Find collection with matching name
    let collection = collections.find(
      (collection) => collection.name === collectionName
    );

    if (!collection) {
      // Create a new collection with the specified embedding size
      const createResponse = await axios.post(
        `${CHROMA_DB_API_URL}/api/v1/collections`,
        {
          name: collectionName,
          embedding_size: embeddingDimension,
        }
      );
      collection = createResponse.data;
    } else {
      // Check if embedding sizes match
      if (collection.embedding_size !== embeddingDimension) {
        throw new Error(
          `Existing collection '${collectionName}' has embedding size ${collection.embedding_size}, expected ${embeddingDimension}.`
        );
      }
    }

    collectionIdCache[collectionName] = collection.id;
    return collection.id;
  } catch (error) {
    console.error(
      "Error ensuring collection exists:",
      error.response?.data || error.message
    );
    throw error;
  }
};

exports.addDocument = async (
  collectionName,
  documentId,
  content,
  embedding,
  metadata,
  embeddingDimension
) => {
  let collectionId; // Declare collectionId here
  try {
    collectionId = await ensureCollectionExists(
      collectionName,
      embeddingDimension
    );

    const response = await axios.post(
      `${CHROMA_DB_API_URL}/api/v1/collections/${collectionId}/add`,
      {
        ids: [documentId],
        documents: [content],
        embeddings: [embedding],
        metadatas: [metadata],
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error adding document to ChromaDB at ${CHROMA_DB_API_URL}/api/v1/collections/${collectionId}/add:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

exports.queryDocuments = async (
  collectionName,
  queryEmbedding,
  nResults,
  filters,
  embeddingDimension
) => {
  let collectionId; // Declare collectionId here
  try {
    collectionId = await ensureCollectionExists(
      collectionName,
      embeddingDimension
    );

    const response = await axios.post(
      `${CHROMA_DB_API_URL}/api/v1/collections/${collectionId}/query`,
      {
        query_embeddings: [queryEmbedding],
        n_results: nResults,
        where: filters,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error querying ChromaDB at ${CHROMA_DB_API_URL}/api/v1/collections/${collectionId}/query:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

exports.getDocuments = async (
  collectionName,
  filters,
  embeddingDimension
) => {
  let collectionId; // Declare collectionId here
  try {
    collectionId = await ensureCollectionExists(
      collectionName,
      embeddingDimension
    );

    const response = await axios.post(
      `${CHROMA_DB_API_URL}/api/v1/collections/${collectionId}/get`,
      {
        where: filters || {},
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error retrieving documents from ChromaDB at ${CHROMA_DB_API_URL}/api/v1/collections/${collectionId}/get:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

exports.updateDocumentMetadata = async (
  collectionName,
  documentId,
  metadata,
  embeddingDimension
) => {
  let collectionId; // Declare collectionId here
  try {
    collectionId = await ensureCollectionExists(
      collectionName,
      embeddingDimension
    );

    const response = await axios.post(
      `${CHROMA_DB_API_URL}/api/v1/collections/${collectionId}/update`,
      {
        ids: [documentId],
        metadatas: [metadata],
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating document metadata in ChromaDB at ${CHROMA_DB_API_URL}/api/v1/collections/${collectionId}/update:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
