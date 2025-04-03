const express = require("express");
const router = express.Router();

// ✅ Import all controller functions
const {
  createFreelancer,
  getAllFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
  forgotPassword,  // ✅ Make sure this is included
  resetPassword,
  loginFreelancer,
} = require("../controllers/freelancerController");

// ✅ Define routes
router.post("/register", createFreelancer);
router.get("/", getAllFreelancers);
router.get("/:id", getFreelancerById);
router.put("/:id", updateFreelancer);
router.delete("/:id", deleteFreelancer);
router.post("/forgot-password", forgotPassword); // ✅ Fixes the error
router.post("/reset-password", resetPassword);
router.post("/login", loginFreelancer);

module.exports = router;
