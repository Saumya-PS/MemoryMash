const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Memory = require("../models/memory.model");
const embeddingService = require("../services/embedding.service");
const memoryService = require("../services/memory.service");





// POST /api/v1/search/related
// Page text in, top related saved memories out (Memory Injection).

const findRelatedMemories = asyncHandler(async (req, res) => {

    const { title, content } = req.body;

    if (!title && !content) {
        throw new ApiError(400, "title or content is required to find related memories");
    }

    const embeddingText = embeddingService.buildEmbeddingText({
        title,
        summary: content,
        topics: [],
        tags: [],
        userIntent: "",
        notes: ""
    });

    const embedding = await embeddingService.generateEmbedding(embeddingText);

    const relatedMemories = await memoryService.findRelatedMemories({
        userId: req.user._id,
        embedding
    });

    return res.status(200).json(
        new ApiResponse(200, { relatedMemories }, "Related memories fetched successfully")
    );

});



// GET /api/v1/search?q=
// Keyword matches first, then semantic matches, without duplicates.

const searchMemories = asyncHandler(async (req, res) => {

    const { q } = req.query;

    if (!q) {
        throw new ApiError(400, "A search query 'q' is required");
    }

    const keywordResults = await Memory.find({
        user: req.user._id,
        $text: { $search: q }
    });

    const queryEmbedding = await embeddingService.generateEmbedding(q);

    const semanticResults = await memoryService.findRelatedMemories({
        userId: req.user._id,
        embedding: queryEmbedding,
        limit: 10
    });

    const seenIds = new Set();
    const combinedResults = [];

    keywordResults.forEach((memory) => {
        seenIds.add(memory._id.toString());
        combinedResults.push(memory);
    });

    semanticResults.forEach((memory) => {
        if (!seenIds.has(memory._id.toString())) {
            seenIds.add(memory._id.toString());
            combinedResults.push(memory);
        }
    });

    return res.status(200).json(
        new ApiResponse(200, combinedResults, "Search results fetched successfully")
    );

});




module.exports = {
    findRelatedMemories,
    searchMemories
};
