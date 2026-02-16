// backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // מאפשר לשרת לקרוא JSON מה-Body

// Routes
app.use("/api/admin", adminRoutes);

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
