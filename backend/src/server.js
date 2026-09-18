require("dotenv").config();

const app = require("./app");
const connectDB = require("./db/connect");

const PORT = process.env.PORT || 8000;




// Connects to MongoDB first, and only starts listening for requests
// once that succeeds, so the server never accepts traffic without a
// working database connection.

connectDB()
    .then(() => {

        app.listen(PORT, () => {
            console.log(`MemoryMesh backend listening on http://localhost:${PORT}`);
        });

    })
    .catch((error) => {

        console.error("Failed to start the server:", error.message);
        process.exit(1);

    });
