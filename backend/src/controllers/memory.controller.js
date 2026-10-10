const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Memory = require("../models/memory.model");
const aiService = require("../services/ai.service");
const embeddingService = require("../services/embedding.service");






// POST /api/v1/memories
// Saves a page: AI analysis, then embedding, then MongoDB.

const createMemory = asyncHandler(async (req, res) => {

    const {
        url,
        title,
        content,
        userIntent,
        notes,
        collection
    } = req.body;

    if (!url || !title) {
        throw new ApiError(400, "url and title are required to save a memory");
    }

    const analysis = await aiService.analyzePageContent({ title, content, userIntent });

    const embeddingText = embeddingService.buildEmbeddingText({
        title,
        summary: analysis.summary,
        topics: analysis.topics,
        tags: analysis.tags,
        userIntent,
        notes
    });

    const embedding = await embeddingService.generateEmbedding(embeddingText);

    const memory = await Memory.create({
        user: req.user._id,
        url,
        title,
        content,
        userIntent,
        notes,
        collection: collection || null,
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        topics: analysis.topics,
        tags: analysis.tags,
        embedding
    });

    return res.status(201).json(
        new ApiResponse(201, memory, "Memory saved successfully")
    );

});






// GET /api/v1/memories  (?q= keyword, ?collection= id)

const getMemories = asyncHandler(async (req, res) => {

    const { q, collection } = req.query;

    const query = { user: req.user._id };

    if (collection) {
        query.collection = collection;
    }

    if (q) {
        query.$text = { $search: q };
    }

    const memories = await Memory.find(query).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, memories, "Memories fetched successfully")
    );

});





// GET /api/v1/memories/:id

const getMemoryById = asyncHandler(async (req, res) => {

    const memory = await Memory.findOne({ _id: req.params.id, user: req.user._id });

    if (!memory) {
        throw new ApiError(404, "Memory not found");
    }

    return res.status(200).json(
        new ApiResponse(200, memory, "Memory fetched successfully")
    );

});




// PUT /api/v1/memories/:id
// Re-embeds when a field that changes the meaning is edited.

const updateMemory = asyncHandler(async (req, res) => {

    const memory = await Memory.findOne({ _id: req.params.id, user: req.user._id });

    if (!memory) {
        throw new ApiError(404, "Memory not found");
    }

    const editableFields = ["title", "userIntent", "notes", "tags", "collection"];
    let meaningChanged = false;

    editableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            memory[field] = req.body[field];
            if (field !== "collection") {
                meaningChanged = true;
            }
        }
    });

    if (meaningChanged) {

        const embeddingText = embeddingService.buildEmbeddingText({
            title: memory.title,
            summary: memory.summary,
            topics: memory.topics,
            tags: memory.tags,
            userIntent: memory.userIntent,
            notes: memory.notes
        });

        memory.embedding = await embeddingService.generateEmbedding(embeddingText);

    }

    await memory.save();

    return res.status(200).json(
        new ApiResponse(200, memory, "Memory updated successfully")
    );

});



// DELETE /api/v1/memories/:id

const deleteMemory = asyncHandler(async (req, res) => {

    const memory = await Memory.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!memory) {
        throw new ApiError(404, "Memory not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Memory deleted successfully")
    );

});






module.exports = {
    createMemory,
    getMemories,
    getMemoryById,
    updateMemory,
    deleteMemory
};
