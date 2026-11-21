// Import Packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import Database Connection
const db = require("./config/db");

// Import Student Routes
const studentRoutes = require("./routes/studentRoutes");

// Create Express Application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Student API Routes
app.use("/api/students", studentRoutes);

// Test API Route
app.get("/", (req, res) => {
  res.send("Student Management System Backend is Running!");
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
