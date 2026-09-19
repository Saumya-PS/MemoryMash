const express = require("express");
const verifyJWT = require("../middlewares/auth.middleware");
const {
    registerUser,
    loginUser,
    getCurrentUser,
    deleteAccount
} = require("../controllers/auth.controller");

const router = express.Router();




router.post("/register", registerUser);



router.post("/login", loginUser);



router.get("/me", verifyJWT, getCurrentUser);



router.delete("/account", verifyJWT, deleteAccount);




module.exports = router;
