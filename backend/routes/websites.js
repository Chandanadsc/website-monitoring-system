const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Website = require("../models/Website");
const StatusHistory = require("../models/StatusHistory");

// Get all websites for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const websites = await Website.find({ user: req.userId });
    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new website
router.post("/", auth, async (req, res) => {
  try {
    const website = new Website({
      ...req.body,
      user: req.userId,
      status: "pending",
    });
    const newWebsite = await website.save();
    res.status(201).json(newWebsite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a website
router.delete("/:id", auth, async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    // Delete associated status history
    await StatusHistory.deleteMany({ website: req.params.id });

    res.json({ message: "Website deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a website
router.put("/:id", auth, async (req, res) => {
  try {
    const website = await Website.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: req.body },
      { new: true }
    );

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    res.json(website);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single website
router.get("/:id", auth, async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    // Get recent status history
    const history = await StatusHistory.find({ website: req.params.id })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({ ...website.toObject(), history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
