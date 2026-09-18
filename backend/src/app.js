const express = require("express");
const cors = require("cors");

const app = express();

// The browser extension makes requests from a chrome-extension://
// origin, and the dashboard makes requests from CLIENT_URL, so CORS
// is left fairly open here for the student project. Tighten this
// with a real allow-list before deploying anywhere public.
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));




// Route: GET /health
// Simple health check used to confirm the server is running.
app.get("/health", (req, res) => {

    res.status(200).json({ success: true, message: "MemoryMesh backend is running" });

});




// Feature routes (auth, memories, search, collections) and the global
// error middleware are added in later commits as those pieces exist.

module.exports = app;
