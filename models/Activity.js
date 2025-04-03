const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "owner_type",
    },
    owner_type: {
      type: String,
      enum: ["Freelancer", "Company"],
      required: true,
    },
    post_type: {
      type: String,
      enum: ["Job Posting", "Project Update", "General Post"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mentions: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        user_type: {
          type: String,
          enum: ["Freelancer", "Company"],
          required: true,
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["Public", "Private", "Connections Only"],
      default: "Public",
    },
    likes: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        liked_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment_text: {
          type: String,
          required: true,
        },
        commented_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
