const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.model");
const Memory = require("../models/memory.model");




// POST /api/v1/auth/register

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are all required");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
        throw new ApiError(409, "An account with this email already exists");
    }

    const user = await User.create({ name, email, password });

    const accessToken = user.generateAccessToken();

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                accessToken
            },
            "Account created successfully"
        )
    );

});



// POST /api/v1/auth/login

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                accessToken
            },
            "Logged in successfully"
        )
    );

});



// GET /api/v1/auth/me

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );

});



// DELETE /api/v1/auth/account
// Collections and conversations get cleaned up here too once those
// models exist (added in later commits).

const deleteAccount = asyncHandler(async (req, res) => {

    await Memory.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    return res.status(200).json(
        new ApiResponse(200, null, "Account deleted successfully")
    );

});




module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    deleteAccount
};
