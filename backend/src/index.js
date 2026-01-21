// backend/src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---

// 1. Enable CORS: Allows your React app (on localhost:5173) to talk to this server
app.use(cors());

// 2. Body Parser: Allows server to read JSON data sent from the client
app.use(express.json());

// --- Routes ---

// Health Check Route - Just to see if server is alive
app.get("/", (req, res) => {
  res.send({
    message: "Dolev API is running successfully!",
    timestamp: new Date().toISOString(),
  });
});

// TODO: Add Diagnostic Routes here later
// app.use('/api/diagnostics', diagnosticRoutes);

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
