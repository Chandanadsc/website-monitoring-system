const axios = require("axios");
const Website = require("../models/Website");
const StatusHistory = require("../models/StatusHistory");
const { sendNotification } = require("./notifications");

async function checkWebsites() {
  const websites = await Website.find({ alertsEnabled: true }).populate("user");
  console.log(`Starting monitoring check for ${websites.length} websites`);

  for (const website of websites) {
    try {
      const result = await checkSingleWebsite(website);
      await updateWebsiteStatus(website, result);
    } catch (error) {
      console.error(`Error checking website ${website.url}:`, error);
      await handleWebsiteError(website);
    }
  }
}

async function checkSingleWebsite(website) {
  const startTime = Date.now();
  const response = await axios.get(website.url, {
    timeout: 30000,
    validateStatus: false,
  });
  const responseTime = Date.now() - startTime;

  return {
    status: response.status,
    responseTime,
    isUp: response.status >= 200 && response.status < 300,
  };
}

async function updateWebsiteStatus(website, result) {
  const newStatus = result.isUp ? "up" : "down";

  await StatusHistory.create({
    website: website._id,
    status: result.status,
    responseTime: result.responseTime,
    timestamp: new Date(),
  });

  if (website.status !== newStatus) {
    await sendNotification(website, newStatus, result.responseTime);
  }

  const statistics = await calculateStatistics(website._id);

  await Website.findByIdAndUpdate(website._id, {
    status: newStatus,
    lastChecked: new Date(),
    statistics,
  });
}

async function handleWebsiteError(website) {
  await StatusHistory.create({
    website: website._id,
    status: 0,
    responseTime: null,
    timestamp: new Date(),
  });

  if (website.status === "up") {
    await sendNotification(website, "down");
  }

  const statistics = await calculateStatistics(website._id);

  await Website.findByIdAndUpdate(website._id, {
    status: "down",
    lastChecked: new Date(),
    statistics,
  });
}

async function calculateStatistics(websiteId) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const history = await StatusHistory.find({
    website: websiteId,
    timestamp: { $gte: oneHourAgo },
  });

  if (!history.length) {
    return {
      uptime: 100,
      averageResponseTime: 0,
      totalChecks: 0,
      downtimeCount: 0,
    };
  }

  const totalChecks = history.length;
  const downtimeCount = history.filter(
    (check) => check.status === 0 || check.status >= 400
  ).length;

  const uptime = ((totalChecks - downtimeCount) / totalChecks) * 100;
  const responseTimes = history
    .filter((check) => check.responseTime != null)
    .map((check) => check.responseTime);

  return {
    uptime,
    averageResponseTime: responseTimes.length
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0,
    totalChecks,
    downtimeCount,
    lastDowntime:
      downtimeCount > 0
        ? history.find((check) => check.status === 0 || check.status >= 400)
            ?.timestamp
        : null,
  };
}

module.exports = {
  checkWebsites,
  calculateStatistics,
};
