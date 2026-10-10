const express = require("express");
const verifyJWT = require("../middlewares/auth.middleware");
const {
    findRelatedMemories,
    searchMemories
} = require("../controllers/search.controller");

const router = express.Router();

router.use(verifyJWT);



router.get("/", searchMemories);





router.post("/related", findRelatedMemories);






module.exports = router;
