const nodemailer = require("nodemailer");
const NotificationTemplate = require("../models/NotificationTemplate");
const User = require("../models/User");
const twilio = require("twilio");

// Initialize Twilio client only if credentials are properly configured
let twilioClient = null;
if (
  process.env.TWILIO_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_SID.startsWith("AC")
) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (error) {
    console.warn("Failed to initialize Twilio client:", error.message);
  }
}

// Create reusable transporter only if email credentials are configured
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } catch (error) {
    console.warn("Failed to initialize email transporter:", error.message);
  }
}

async function getNotificationTemplate(user, type) {
  let template = await NotificationTemplate.findOne({
    user: user._id,
    name: type,
  });

  if (!template) {
    // Use default template
    template = {
      subject: "Website Monitor Alert: {{websiteName}} {{status}}",
      template: `
        <h2>Website Status Alert</h2>
        <p><strong>Website:</strong> {{websiteName}}</p>
        <p><strong>URL:</strong> <a href="{{websiteUrl}}">{{websiteUrl}}</a></p>
        <p><strong>Status:</strong> {{status}}</p>
        {{#if responseTime}}<p><strong>Response Time:</strong> {{responseTime}}ms</p>{{/if}}
        <p><strong>Time:</strong> {{timestamp}}</p>
      `,
    };
  }

  return template;
}

async function sendNotification(website, status, responseTime = null) {
  try {
    const user = await User.findById(website.user);
    if (!user) throw new Error("User not found");

    const statusText = status === "down" ? "is down!" : "is back up!";
    const template = await getNotificationTemplate(user, status);

    const variables = {
      websiteName: website.name,
      websiteUrl: website.url,
      status: statusText,
      responseTime,
      timestamp: new Date().toLocaleString(),
    };

    // Send based on user preference and available notification methods
    if (user.preferredNotification === "sms" && twilioClient) {
      await sendSMS(user.phoneNumber, template, variables);
    } else if (transporter) {
      await sendEmail(user.email, template, variables);
    } else {
      console.warn(`No notification method available for user ${user._id}`);
    }
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

async function sendEmail(to, template, variables) {
  const subject = replaceVariables(template.subject, variables);
  const html = replaceVariables(template.template, variables);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}

async function sendSMS(to, template, variables) {
  if (!twilioClient) throw new Error("Twilio not configured");

  const message = replaceVariables(template.template, variables)
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .trim();

  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to,
  });
}

function replaceVariables(text, variables) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || "");
}

module.exports = { sendNotification };
