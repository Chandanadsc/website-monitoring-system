const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    checkInterval: {
      type: Number,
      required: true,
      default: 5,
    },
    status: {
      type: String,
      enum: ["up", "down", "pending"],
      default: "pending",
    },
    lastChecked: {
      type: Date,
      default: Date.now,
    },
    alertsEnabled: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    statistics: {
      uptime: { type: Number, default: 100 },
      averageResponseTime: { type: Number, default: 0 },
      totalChecks: { type: Number, default: 0 },
      downtimeCount: { type: Number, default: 0 },
      lastDowntime: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Website", websiteSchema);
