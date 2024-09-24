const axios = require("axios");

const CHROMA_DB_API_URL =
  process.env.CHROMA_DB_API_URL || "http://localhost:8000";

let collectionIdCache = {};

const ensureCollectionExists = async (collectionName) => {
  if (collectionIdCache[collectionName]) {
    return collectionIdCache[collectionName];
  }
  try {
    const response = await axios.get(`${CHROMA_DB_API_URL}/api/v1/collections`);
    const collections = response.data;

    let collection = collections.find(
      (collection) => collection.name === collectionName
    );

    if (!collection) {
      const createResponse = await axios.post(
        `${CHROMA_DB_API_URL}/api/v1/collections`,
        {
          name: collectionName,
        }
      );
      collection = createResponse.data;
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
  metadata
) => {
  try {
    const collectionId = await ensureCollectionExists(collectionName);

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
  filters
) => {
  try {
    const collectionId = await ensureCollectionExists(collectionName);

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

exports.getDocuments = async (collectionName, filters) => {
  try {
    const collectionId = await ensureCollectionExists(collectionName);

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
  metadata
) => {
  try {
    const collectionId = await ensureCollectionExists(collectionName);

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
