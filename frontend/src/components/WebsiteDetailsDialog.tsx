import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
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
import { Website } from "../types";

interface Props {
  website: Website;
  onClose: () => void;
}

export const WebsiteDetailsDialog = ({ website, onClose }: Props) => {
  const chartData = website.statusHistory.map((history) => ({
    time: format(new Date(history.timestamp), "HH:mm"),
    responseTime: history.responseTime || 0,
    status: history.status,
  }));

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{website.name} - Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="textSecondary">
            URL: {website.url}
          </Typography>
          <Typography variant="body2">
            Description: {"No description"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography>
            Uptime: {website.statistics.uptime.toFixed(2)}%
          </Typography>
          <Typography>
            Average Response Time:{" "}
            {website.statistics.averageResponseTime.toFixed(0)}ms
          </Typography>
          <Typography>
            Total Checks: {website.statistics.totalChecks}
          </Typography>
          <Typography>
            Downtime Count: {website.statistics.downtimeCount}
          </Typography>
          {website.statistics.lastDowntime && (
            <Typography>
              Last Downtime:{" "}
              {format(new Date(website.statistics.lastDowntime), "PPpp")}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Response Time History
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit="ms" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#8884d8"
                name="Response Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
