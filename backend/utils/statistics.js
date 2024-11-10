const calculateStatistics = (website) => {
  const now = new Date();
  const history = website.statusHistory;

  if (!history.length) return website.statistics;

  const totalChecks = history.length;
  const downtimeCount = history.filter((h) => h.status === "down").length;
  const uptime = ((totalChecks - downtimeCount) / totalChecks) * 100;

  const responseTimes = history
    .filter((h) => h.responseTime)
    .map((h) => h.responseTime);

  const averageResponseTime = responseTimes.length
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;

  const lastDowntime = history
    .filter((h) => h.status === "down")
    .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp;

  return {
    uptime,
    averageResponseTime,
    totalChecks,
    lastDowntime,
    downtimeCount,
  };
};

module.exports = { calculateStatistics };
