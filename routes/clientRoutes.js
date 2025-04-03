const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController"); // ✅ Ensure correct path

router.post("/register", clientController.registerClient);

module.exports = router;
