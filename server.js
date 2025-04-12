const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gymdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Schema
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  health: { type: String },
  membership: { type: String, required: true },
  trainer: { type: String, required: true }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Routes

// POST: Register new user
app.post('/register', async (req, res) => {
  try {
    const { name, email, phone, age, membership, trainer } = req.body;

    if (!name || !email || !phone || !age || !membership || !trainer) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await Registration.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const newRegistration = new Registration({
      ...req.body,
      email: normalizedEmail
    });

    await newRegistration.save();

    res.status(200).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// GET: All registered users
app.get('/users', async (req, res) => {
  try {
    const users = await Registration.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// GET: Single user by email (case-insensitive)
app.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await Registration.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// PUT: Update user by ID
app.put('/update/:id', async (req, res) => {
  try {
    const updated = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// DELETE: Remove user by ID
app.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
module.exports = app; 
