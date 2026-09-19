const ApiError = require("../utils/ApiError");




// Formats every thrown error into a consistent JSON response.

const errorMiddleware = (err, req, res, next) => {

    let error = err;



    if (!(error instanceof ApiError)) {

        let statusCode = error.statusCode || 500;
        let message = error.message || "Internal Server Error";

        if (error.name === "ValidationError") {
            statusCode = 400;
            message = Object.values(error.errors)
                .map((val) => val.message)
                .join(", ");
        }

        if (error.name === "CastError") {
            statusCode = 400;
            message = `Invalid value for field "${error.path}"`;
        }

        if (error.code === 11000) {
            statusCode = 409;
            const field = Object.keys(error.keyValue || {})[0];
            message = `${field ? field : "Field"} already exists`;
        }

        if (error.name === "JsonWebTokenError") {
            statusCode = 401;
            message = "Invalid access token";
        }

        if (error.name === "TokenExpiredError") {
            statusCode = 401;
            message = "Access token expired";
        }

        error = new ApiError(statusCode, message, error.errors || []);

    }




    console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${error.message}`);

    if (process.env.NODE_ENV !== "production") {
        console.error(error.stack);
    }




    return res.status(error.statusCode || 500).json({ 
        success: false, 
        message: error.message, 
        statusCode: error.statusCode || 500 });

};




module.exports = errorMiddleware;
