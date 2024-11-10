import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { Website } from "../types";
import { format } from "date-fns";
import { useToggleAlerts } from "../hooks/useWebsites";

interface Props {
  website: Website;
}

export const WebsiteCard = ({ website }: Props) => {
  const toggleAlerts = useToggleAlerts();

  const handleToggleAlerts = () => {
    toggleAlerts.mutate(website._id);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {website.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {website.url}
        </Typography>
        <Chip
          label={website.status}
          color={
            website.status === "up"
              ? "success"
              : website.status === "down"
              ? "error"
              : "default"
          }
        />
        <Typography variant="body2" component="p">
          Last checked: {format(new Date(website.lastChecked), "PPpp")}
        </Typography>
        <Typography variant="body2">
          Uptime: {website.statistics.uptime.toFixed(2)}%
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleToggleAlerts}>
          {website.alertsEnabled ? "Disable Alerts" : "Enable Alerts"}
        </Button>
      </CardActions>
    </Card>
  );
};
