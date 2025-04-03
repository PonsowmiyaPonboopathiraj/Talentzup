const express = require("express");
const {
  createActivity,
  getActivities,
  getUserActivities,
  likeActivity,
  commentActivity,
  deleteActivity,
} = require("../controllers/activityController");

const router = express.Router();

// ✅ Create a new activity post
router.post("/", createActivity);

// ✅ Get all public activities
router.get("/", getActivities);

// ✅ Get activities for a specific user
router.get("/:userId", getUserActivities);

// ✅ Like an activity
router.post("/:activityId/like", likeActivity);

// ✅ Comment on an activity
router.post("/:activityId/comment", commentActivity);

// ✅ Soft delete an activity
router.delete("/:activityId", deleteActivity);

module.exports = router;
