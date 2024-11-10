const express = require("express");
const router = express.Router();
const Website = require("../models/Website");
const StatusHistory = require("../models/StatusHistory");
const { createUserRateLimit } = require("../middleware/userRateLimit");

const monitoringLimit = createUserRateLimit(100, 15 * 60 * 1000);

router.get("/status/:websiteId", monitoringLimit, async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.websiteId,
      user: req.userId,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    const history = await StatusHistory.find({ website: website._id })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      currentStatus: website.status,
      lastChecked: website.lastChecked,
      statistics: website.statistics,
      history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
