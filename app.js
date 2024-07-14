const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // Import path module

// Routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const paypalRoutes = require("./routes/paypalRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/admins", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/paypal", paypalRoutes);

// Serve static files (assuming 'client' directory contains your frontend build)
app.use(express.static(path.resolve("client")));

// Serve index.html (or checkout.html for PayPal integration)
app.get("/", (req, res) => {
  res.sendFile(path.resolve("checkout.html"));
});

// Start server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
