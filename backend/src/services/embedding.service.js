const OpenAI = require("openai");
const ApiError = require("../utils/ApiError");




const getClient = () => {

    if (!process.env.AI_API_KEY) {
        throw new ApiError(500, "AI_API_KEY is not configured on the server");
    }

    return new OpenAI({
        apiKey: process.env.AI_API_KEY,
        baseURL: process.env.AI_API_BASE_URL || "https://api.openai.com/v1"
    });

};




// Text in, vector of numbers out. Powers semantic search.

const generateEmbedding = async (text) => {

    const client = getClient();

    const input = (text || "").slice(0, 8000);

    if (!input.trim()) {
        return [];
    }

    const response = await client.embeddings.create({
        model: process.env.AI_EMBEDDING_MODEL || "text-embedding-3-small",
        input
    });

    return response.data[0]?.embedding || [];

};




// Joins a memory's meaningful fields into one block to embed.

const buildEmbeddingText = ({ title, summary, topics, tags, userIntent, notes }) => {

    return [
        title,
        summary,
        (topics || []).join(", "),
        (tags || []).join(", "),
        userIntent,
        notes
    ]
        .filter(Boolean)
        .join("\n");

};





// Similarity between two vectors: 1 means identical meaning.

const cosineSimilarity = (vectorA, vectorB) => {

    if (!vectorA.length || !vectorB.length || vectorA.length !== vectorB.length) {
        return 0;
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];
        magnitudeA += vectorA[i] * vectorA[i];
        magnitudeB += vectorB[i] * vectorB[i];
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));

};





module.exports = {
    generateEmbedding,
    buildEmbeddingText,
    cosineSimilarity
};
