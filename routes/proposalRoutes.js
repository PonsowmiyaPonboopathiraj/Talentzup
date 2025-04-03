const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposalController");

// ✅ Ensure all controller functions are correctly referenced
router.post("/", proposalController.createProposal);
router.get("/", proposalController.getAllProposals);
router.get("/:id", proposalController.getProposalById);
router.put("/:id", proposalController.updateProposal); 
router.patch("/:id", proposalController.updateProposal); // ✅ Fixed this line
router.delete("/:id", proposalController.deleteProposal);

module.exports = router;
