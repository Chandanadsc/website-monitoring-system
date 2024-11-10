import { Grid, Paper, Typography, Box } from "@mui/material";
import { Timeline, CheckCircle, Error, Speed } from "@mui/icons-material/";
import { Website } from "../types";

interface Props {
  websites: Website[];
}

export const WebsiteStats = ({ websites }: Props) => {
  const totalWebsites = websites.length;
  const websitesUp = websites.filter((w) => w.status === "up").length;
  const websitesDown = websites.filter((w) => w.status === "down").length;
  const averageUptime =
    websites.reduce((acc, w) => acc + w.statistics.uptime, 0) / totalWebsites ||
    0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center">
            <Timeline color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Total Websites
            </Typography>
          </Box>
          <Typography variant="h4" component="div" sx={{ mt: 2 }}>
            {totalWebsites}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};
