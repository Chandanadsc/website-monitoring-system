const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  events: [
    {
      type: String,
      enum: ["down", "up", "ssl_expiring", "high_latency"],
    },
  ],
  headers: {
    type: Map,
    of: String,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Webhook", webhookSchema);
