export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  preferredNotification: "email" | "sms";
}

export interface Website {
  _id: string;
  name: string;
  url: string;
  checkInterval: number;
  status: "up" | "down" | "pending";
  lastChecked: string;
  alertsEnabled: boolean;
  statistics: {
    uptime: number;
    averageResponseTime: number;
    totalChecks: number;
    downtimeCount: number;
    lastDowntime?: string;
  };
  statusHistory: StatusHistory[];
}

export interface StatusHistory {
  timestamp: string;
  status: number;
  responseTime: number;
}

export interface Statistics {
  uptime: number;
  averageResponseTime: number;
  totalChecks: number;
  lastDowntime: string | null;
  downtimeCount: number;
}

export interface MonitoringData {
  websiteId: string;
  data: {
    timestamp: string;
    status: number;
    responseTime: number;
  }[];
}
