const express = require("express");

const authRoutes = require("./auth.routes");

const router = express.Router();




router.use("/auth", authRoutes);



// memories, collections, search and conversations routers get
// mounted here as those pieces are built out.




module.exports = router;
