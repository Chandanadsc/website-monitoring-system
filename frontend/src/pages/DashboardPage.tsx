import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Language,
  CheckCircle,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Website } from "../types";
import { useWebsites } from "../hooks/useWebsites";
import { StatusCard } from "../components/dashboard/StatusCard";
import { ResponseTimeChart } from "../components/dashboard/ResponseTimeChart";
import { StatusDistributionChart } from "../components/dashboard/StatusDistributionChart";
import { IncidentsList } from "../components/dashboard/IncidentsList";
import { TimeRangeSelector } from "../components/dashboard/TimeRangeSelector";

export const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const { data: websites, isLoading, error, refetch } = useWebsites();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load dashboard data
      </Alert>
    );
  }

  const totalWebsites = websites?.length || 0;
  const websitesUp = websites?.filter((w) => w.status === "up").length || 0;
  const websitesDown = websites?.filter((w) => w.status === "down").length || 0;
  const websitesPending = totalWebsites - websitesUp - websitesDown;

  const averageUptime =
    (websites?.reduce((acc, site) => acc + site.statistics.uptime, 0) || 0) /
    totalWebsites;

  const statusData = [
    { name: "Up", value: websitesUp },
    { name: "Down", value: websitesDown },
    { name: "Pending", value: websitesPending },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography variant="h4">Dashboard Overview</Typography>
        <Box display="flex" gap={2}>
          <TimeRangeSelector
            value={timeRange}
            onChange={(value) => setTimeRange(value as "24h" | "7d" | "30d")}
          />
          <Tooltip title="Refresh Data">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Total Websites"
            value={totalWebsites}
            icon={<Language />}
            subtitle="Monitored Websites"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatusCard
            title="Websites Up"
            value={websitesUp}
            icon={<CheckCircle />}
            subtitle="Operational"
            color="success.main"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatusCard
            title="Websites Down"
            value={websitesDown}
            icon={<ErrorIcon />}
            subtitle="Need Attention"
            color="error.main"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Response Time Trends
            </Typography>
            <ResponseTimeChart
              websites={websites || []}
              timeRange={timeRange as "24h" | "7d" | "30d"}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status Distribution
            </Typography>
            <StatusDistributionChart data={statusData} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Incidents
            </Typography>
            <IncidentsList websites={websites || []} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
