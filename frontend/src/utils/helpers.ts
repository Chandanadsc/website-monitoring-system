import { Website, StatusHistory } from "../types";
import { format, subHours, subDays } from "date-fns";

export const getTimeRangeData = (
  history: StatusHistory[],
  timeRange: "24h" | "7d" | "30d"
) => {
  const now = new Date();
  const timeRanges = {
    "24h": subHours(now, 24),
    "7d": subDays(now, 7),
    "30d": subDays(now, 30),
  };

  return history
    .filter((h) => new Date(h.timestamp) >= timeRanges[timeRange])
    .map((h) => ({
      time: format(new Date(h.timestamp), "HH:mm"),
      responseTime: h.responseTime || 0,
    }));
};

export const calculateAverageUptime = (websites: Website[]) => {
  if (!websites.length) return 0;
  return (
    websites.reduce((acc, site) => acc + site.statistics.uptime, 0) /
    websites.length
  );
};

export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};
