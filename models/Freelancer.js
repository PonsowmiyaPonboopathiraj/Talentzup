const mongoose = require("mongoose");
const FreelancerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_picture: { type: String, default: "" },
  bio: { type: String, required: true },
  skills: { type: [String], required: true },
  age: { type: Number, required: true },  // ✅ Added Age Field
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  payment_type: {
    type: [String], // Allow an array of strings
    enum: ["Fixed", "Hourly", "Milestone"],
    required: true
  },
  fixed_price: { type: Number },  // Store if Fixed price is available
  hourly_rate: { type: Number },  // Store if Hourly model is available
  milestone_rates: { type: [Number] },
  experience_years: { type: Number, required: true },  // ✅ Added Experience in Years
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      duration: { type: String, required: true },
    },
  ],
  projects_completed: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
      review_text: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      date: { type: Date, default: Date.now },
    },
  ],
  portfolio: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  availability: { type: String, enum: ["Full-time", "Part-time", "Freelance"], required: true },
  hourly_rate: { type: Number, required: true },
  location: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Freelancer", FreelancerSchema);
