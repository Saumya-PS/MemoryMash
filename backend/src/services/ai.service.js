const OpenAI = require("openai");
const ApiError = require("../utils/ApiError");






// One shared client for any OpenAI-compatible endpoint.

const getClient = () => {

    if (!process.env.AI_API_KEY) {
        throw new ApiError(500, "AI_API_KEY is not configured on the server");
    }

    return new OpenAI({
        apiKey: process.env.AI_API_KEY,
        baseURL: process.env.AI_API_BASE_URL || "https://api.openai.com/v1"
    });

};




// Turns raw page text into summary, key points, topics and tags.

const analyzePageContent = async ({ title, content, userIntent }) => {

    const client = getClient();

    const systemPrompt = `You are part of "MemoryMesh", a tool that helps a user
remember and connect webpages they save. Given a page title and its visible
text content, respond ONLY with a raw JSON object (no markdown, no code
fences) in this exact shape:
{
  "summary": "1-2 sentence summary of the page",
  "keyPoints": ["very short key point", "very short key point", "very short key point"],
  "topics": ["topic1", "topic2"],
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const userPrompt = `Title: ${title}
User's reason for saving this (may be empty): ${userIntent || "N/A"}
Page content (may be truncated):
${(content || "").slice(0, 6000)}`;

    const response = await client.chat.completions.create({
        model: process.env.AI_CHAT_MODEL || "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.3
    });

    const raw = response.choices[0]?.message?.content || "{}";

    return safeParseJson(raw);

};






// Parses the AI reply, falling back to empty fields if it isn't valid JSON.

const safeParseJson = (raw) => {

    const cleaned = raw.replace(/```json|```/g, "").trim();

    try {

        const parsed = JSON.parse(cleaned);

        return {
            summary: parsed.summary || "",
            keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
            topics: Array.isArray(parsed.topics) ? parsed.topics : [],
            tags: Array.isArray(parsed.tags) ? parsed.tags : []
        };

    } catch (error) {

        console.error("Failed to parse AI JSON response:", error.message);

        return {
            summary: "",
            keyPoints: [],
            topics: [],
            tags: []
        };

    }

};






module.exports = {
    analyzePageContent
};
