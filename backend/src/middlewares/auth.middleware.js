const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");




// Verifies the access token and attaches the user to req.user.

const verifyJWT = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization || "";
    const headerToken = authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "").trim()
        : null;

    const token = headerToken || req.cookies?.accessToken;

    if (!token) {
        throw new ApiError(401, "Not authorized, no access token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
        throw new ApiError(401, "Not authorized, user no longer exists");
    }

    req.user = user;

    next();

});




module.exports = verifyJWT;
