const express = require("express");

const authRoutes = require("./auth.routes");
const memoryRoutes = require("./memory.routes");
const searchRoutes = require("./search.routes");

const router = express.Router();

router.use("/auth", authRoutes);


router.use("/memories", memoryRoutes);

router.use("/search", searchRoutes);

module.exports = router;
