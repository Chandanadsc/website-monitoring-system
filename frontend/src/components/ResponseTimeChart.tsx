import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { StatusHistory } from "../types";

interface Props {
  history: StatusHistory[];
  height?: number;
}

export const ResponseTimeChart = ({ history, height = 300 }: Props) => {
  const chartData = history.map((item) => ({
    time: format(new Date(item.timestamp), "HH:mm"),
    responseTime: item.responseTime || 0,
    status: item.status,
  }));

  if (history.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={height}>
        <Typography color="textSecondary">
          No response time data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis unit="ms" />
          <Tooltip
            formatter={(value: number) => [`${value}ms`, "Response Time"]}
          />
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="#8884d8"
            name="Response Time"
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
