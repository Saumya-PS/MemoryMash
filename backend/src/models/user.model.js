const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false
        }
    },
    {
        timestamps: true
    }
);



// Hashes the password before saving, only if it changed.

userSchema.pre("save", async function hashPassword(next) {

    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();

});



// Compares a plain-text password against the stored hash.

userSchema.methods.isPasswordCorrect = async function isPasswordCorrect(candidatePassword) {

    return bcrypt.compare(candidatePassword, this.password);

};



// Signs a JWT access token for this user.

userSchema.methods.generateAccessToken = function generateAccessToken() {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );

};




module.exports = mongoose.model("User", userSchema);
