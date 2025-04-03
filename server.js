const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Logs HTTP requests in the console

// Import Routes
const freelancerRoutes = require("./routes/freelancerRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const activityRoutes = require("./routes/activityRoutes");
const networkRoutes = require("./routes/networkRoutes");
const proposalRoutes = require("./routes/proposalRoutes");

// API Routes
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/proposals", proposalRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("TalentZup API is perfectly running  Port number 7000...");
});

// Database Connection
const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Start Server only after DB connection
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Display JWT_SECRET only in development mode
if (process.env.NODE_ENV === "development") {
  console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);
}

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

connectDB();
