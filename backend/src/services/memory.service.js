const Memory = require("../models/memory.model");
const { cosineSimilarity } = require("./embedding.service");



// Compares one embedding against all of a user's memories and
// returns the top matches above the similarity threshold.

const findRelatedMemories = async ({ userId, embedding, excludeMemoryId = null, limit = 3 }) => {

    if (!embedding || embedding.length === 0) {
        return [];
    }

    const threshold = Number(process.env.SIMILARITY_THRESHOLD) || 0.75;

    const query = { user: userId, embedding: { $exists: true, $ne: [] } };

    if (excludeMemoryId) {
        query._id = { $ne: excludeMemoryId };
    }

    const candidateMemories = await Memory.find(query).select(
        "title url domain topics tags summary embedding createdAt"
    );

    const scoredMemories = candidateMemories
        .map((memory) => {
            const score = cosineSimilarity(embedding, memory.embedding);
            return { memory, score };
        })
        .filter((entry) => entry.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scoredMemories.map((entry) => ({
        _id: entry.memory._id,
        title: entry.memory.title,
        url: entry.memory.url,
        domain: entry.memory.domain,
        topics: entry.memory.topics,
        tags: entry.memory.tags,
        summary: entry.memory.summary,
        similarity: Number(entry.score.toFixed(3))
    }));

};



module.exports = {
    findRelatedMemories
};
