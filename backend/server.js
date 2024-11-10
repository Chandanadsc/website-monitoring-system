require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const {
  apiLimiter,
  authLimiter,
  monitoringLimiter,
} = require("./middleware/rateLimiter");

// Import routes
const userRoutes = require("./routes/users");
const websiteRoutes = require("./routes/websites");
const monitoringRoutes = require("./routes/monitoring");
const healthRoutes = require("./routes/health");

// Import middleware
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use("/api/", apiLimiter);
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);
app.use("/api/monitoring", monitoringLimiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/websites", auth, websiteRoutes);
app.use("/api/monitoring", auth, monitoringRoutes);
app.use("/health", healthRoutes);

// Error handling
app.use(errorHandler);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Setup monitoring cron job
    const { checkWebsites } = require("./utils/monitor");
    cron.schedule("*/5 * * * *", async () => {
      try {
        await checkWebsites();
      } catch (error) {
        console.error("Error in monitoring job:", error);
      }
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        mongoose.connection.close(false, () => {
          process.exit(0);
        });
      });
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
