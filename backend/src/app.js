const express = require("express");
const cors = require("cors");

<<<<<<< HEAD
const errorMiddleware = require("./middlewares/error.middleware");
const apiRouter = require("./routes/index");

=======
>>>>>>> b98689152d1d7371058e792a28d4023f77269b73
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

<<<<<<< HEAD
    res.status(200).json({ 
        success: true, 
        message: "MemoryMesh backend is running" });
=======
    res.status(200).json({ success: true, message: "MemoryMesh backend is running" });
>>>>>>> b98689152d1d7371058e792a28d4023f77269b73

});




<<<<<<< HEAD
app.use("/api/v1", apiRouter);



// memories, search and collections get mounted onto apiRouter as
// those pieces are built out.

app.use(errorMiddleware);



=======
// Feature routes (auth, memories, search, collections) and the global
// error middleware are added in later commits as those pieces exist.
>>>>>>> b98689152d1d7371058e792a28d4023f77269b73

module.exports = app;
