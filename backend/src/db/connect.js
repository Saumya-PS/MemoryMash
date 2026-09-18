const mongoose = require("mongoose");




// Opens a single connection to MongoDB using the URI from the .env
// file. Called once when the server starts (see server.js).

const connectDB = async () => {

    try {

        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB connected. Host: ${connectionInstance.connection.host}`);

    } catch (error) {

        console.error("MongoDB connection failed:", error.message);
        process.exit(1);

    }

};




module.exports = connectDB;
