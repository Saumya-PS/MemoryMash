const mongoose = require("mongoose");



// Core data model - a single saved webpage or text selection.

const memorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        url: {
            type: String,
            required: [true, "URL is required"],
            trim: true,
            match: [/^https?:\/\/.+/, "URL must start with http:// or https://"]
        },
        domain: {
            type: String,
            trim: true,
            default: ""
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        content: {
            type: String,
            default: ""
        },
        userIntent: {
            type: String,
            trim: true,
            default: ""
        },
        notes: {
            type: String,
            trim: true,
            default: ""
        },
        summary: {
            type: String,
            default: ""
        },
        keyPoints: {
            type: [String],
            default: []
        },
        topics: {
            type: [String],
            default: []
        },
        tags: {
            type: [String],
            default: []
        },
        collection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
            default: null
        },
        embedding: {
            type: [Number],
            default: []
        }
    },
    {
        timestamps: true
    }
);




memorySchema.index({ title: "text", tags: "text", topics: "text" });
memorySchema.index({ user: 1, createdAt: -1 });
memorySchema.index({ collection: 1 });




// Auto-fills "domain" from the URL when it isn't passed in explicitly,
// so callers don't have to parse it themselves.

memorySchema.pre("save", function fillDomain(next) {

    if (!this.domain && this.url) {

        try {
            this.domain = new URL(this.url).hostname.replace("www.", "");
        } catch (err) {
            this.domain = "";
        }

    }

    next();

});




// Short preview of the saved content, used anywhere a card/list view
// needs a quick snippet instead of the full page text.

memorySchema.virtual("excerpt").get(function excerpt() {

    const source = this.notes || this.summary || this.content || "";

    return source.length > 160 ? `${source.slice(0, 160)}...` : source;

});

memorySchema.set("toJSON", { virtuals: true });




// Quick per-user fetch, newest first. Controllers use this instead of
// repeating the same sort/filter everywhere.

memorySchema.statics.findByUser = function findByUser(userId) {

    return this.find({ user: userId }).sort({ createdAt: -1 });

};




// Full-text search scoped to one user, using the text index above.

memorySchema.statics.search = function search(userId, query) {

    return this.find(
        { user: userId, $text: { $search: query } },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

};



// Quick ownership check, used before letting a request touch a memory.

memorySchema.methods.belongsToUser = function belongsToUser(userId) {

    return this.user.toString() === userId.toString();

};




module.exports = mongoose.model("Memory", memorySchema);
