const express = require("express");
const verifyJWT = require("../middlewares/auth.middleware");
const {
    createMemory,
    getMemories,
    getMemoryById,
    updateMemory,
    deleteMemory
} = require("../controllers/memory.controller");

const router = express.Router();

router.use(verifyJWT);




router.post("/", createMemory);




router.get("/", getMemories);





router.get("/:id", getMemoryById);






router.put("/:id", updateMemory);






router.delete("/:id", deleteMemory);






module.exports = router;
