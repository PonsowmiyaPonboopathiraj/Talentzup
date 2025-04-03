const Client = require("../models/Client");

const registerClient = async (req, res) => {
  try {
    const { name, email, password, company, phone,gender } = req.body;

    if (!name || !email || !password || !phone ||!gender ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ error: "Client with this email already exists" });
    }

    const newClient = new Client({ name, email, password, company, phone });
    await newClient.save();

    res.status(201).json({ message: "Client registered successfully", client: newClient });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerClient };
