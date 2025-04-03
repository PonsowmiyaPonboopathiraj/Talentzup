const Freelancer = require("../models/Freelancer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// ✅ Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Configure Nodemailer for email sending
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Create Freelancer
const createFreelancer = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      bio, 
      skills, 
      age, 
      gender,
      payment_type,
      experience_years, 
      experience, 
      projects_completed, 
      rating, 
      reviews, 
      portfolio, 
      availability, 
      hourly_rate, 
      location 
    } = req.body;

    if (!name || !email || !password || !gender || !age || !experience_years) {
      return res.status(400).json({ message: "Name, email, gender, age, experience years and password are required" });
    }

    const existingFreelancer = await Freelancer.findOne({ email });
    if (existingFreelancer) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newFreelancer = new Freelancer({
      name,
      email,
      password: hashedPassword,
      bio,
      skills,
      age,
      gender,
      payment_type,
      experience_years,
      experience,
      projects_completed,
      rating,
      reviews,
      portfolio,
      availability,
      hourly_rate,
      location,
    });
    await newFreelancer.save();
    res.status(201).json({ message: "Freelancer registered successfully", freelancer: newFreelancer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Get freelancers by payment model
const getFreelancersByPaymentModel = async (req, res) => {
  try {
    const { payment_type, budget } = req.body;
    let query = {};

    if (payment_type === "Fixed" && budget) {
      query.fixed_price = { $lte: budget };
    } else if (payment_type === "Hourly" && budget) {
      query.hourly_rate = { $lte: budget };
    } else if (payment_type === "Milestone" && budget) {
      query.milestone_rates = { $lte: budget };
    }

    const freelancers = await Freelancer.find(query);
    res.status(200).json({ success: true, data: freelancers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

// ✅ Get all freelancers
const getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find();
    res.status(200).json(freelancers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get freelancer by ID
const getFreelancerById = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.status(200).json(freelancer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update freelancer details
const updateFreelancer = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedFreelancer = await Freelancer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.status(200).json({ message: "Freelancer updated successfully", freelancer: updatedFreelancer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete freelancer
const deleteFreelancer = async (req, res) => {
  try {
    const deletedFreelancer = await Freelancer.findByIdAndDelete(req.params.id);
    if (!deletedFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.status(200).json({ message: "Freelancer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Forgot Password: Generate Reset Token and Send Email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const freelancer = await Freelancer.findOne({ email });

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    // Generate secure password reset token
    const resetToken = jwt.sign({ id: freelancer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: freelancer.email,
      subject: "Password Reset Request",
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="http://localhost:7000/reset-password/${resetToken}">Reset Password</a>
      `,
    };
    

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset password link sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};

// ✅ Reset Password: Set New Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const freelancer = await Freelancer.findById(decoded.id);

    if (!freelancer) {
      return res.status(404).json({ message: "Invalid token or user not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    freelancer.password = hashedPassword;
    await freelancer.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};

// ✅ Freelancer Login
const loginFreelancer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const freelancer = await Freelancer.findOne({ email });

    if (!freelancer || !(await bcrypt.compare(password, freelancer.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", token: generateToken(freelancer._id) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Export all functions
module.exports = {
  createFreelancer,
  getFreelancersByPaymentModel,
  getAllFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
  forgotPassword,
  resetPassword,
  loginFreelancer,
};