const mongoose = require("mongoose");

const notificationTemplateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    enum: ["up", "down"],
  },
  subject: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "NotificationTemplate",
  notificationTemplateSchema
);
