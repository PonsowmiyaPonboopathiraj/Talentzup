const Activity = require("../models/Activity");

// ✅ Create a new activity post
exports.createActivity = async (req, res) => {
  try {
    const { owner_id, owner_type, post_type, content, mentions, visibility } = req.body;
    
    const activity = new Activity({
      owner_id,
      owner_type,
      post_type,
      content,
      mentions,
      visibility,
    });

    await activity.save();
    res.status(201).json({ message: "Activity created successfully", activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all activity posts (Public posts only)
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ visibility: "Public", isDeleted: false })
      .populate("owner_id", "name email")
      .populate("mentions.user_id", "name email");

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get activities for a specific user (Freelancer/Company)
exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    const activities = await Activity.find({ owner_id: userId, isDeleted: false })
      .populate("owner_id", "name email")
      .populate("mentions.user_id", "name email");

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Like an activity
exports.likeActivity = async (req, res) => {
  try {
    const { user_id } = req.body;
    const { activityId } = req.params;

    const activity = await Activity.findByIdAndUpdate(
      activityId,
      { $push: { likes: { user_id } } },
      { new: true }
    );

    res.json({ message: "Activity liked", activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Comment on an activity
exports.commentActivity = async (req, res) => {
  try {
    const { user_id, comment_text } = req.body;
    const { activityId } = req.params;

    const activity = await Activity.findByIdAndUpdate(
      activityId,
      { $push: { comments: { user_id, comment_text } } },
      { new: true }
    );

    res.json({ message: "Comment added", activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete an activity (Soft Delete)
exports.deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    await Activity.findByIdAndUpdate(activityId, { isDeleted: true });

    res.json({ message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
