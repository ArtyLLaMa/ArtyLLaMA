const express = require("express");
const router = express.Router();

// Import your route handlers
const modelsRoutes = require("./models");
const chatRoutes = require("./chat");
const authRoutes = require("./auth");
const userPreferencesRoutes = require("./userPreferences");

// Use the routes
router.use("/models", modelsRoutes);
router.use("/chat", chatRoutes);
router.use("/auth", authRoutes);
router.use("/user-preferences", userPreferencesRoutes);

module.exports = router;
