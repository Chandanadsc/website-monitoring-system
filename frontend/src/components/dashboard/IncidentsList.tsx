import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  Chip,
  Alert,
} from "@mui/material";
import { format } from "date-fns";
import { Website } from "../../types";

interface Props {
  websites: Website[];
}

interface Incident {
  websiteId: string;
  websiteName: string;
  timestamp: string;
  status: number;
}

export const IncidentsList = ({ websites }: Props) => {
  const generateSampleIncidents = (): Incident[] => {
    return websites.slice(0, 3).map((website) => ({
      websiteId: website._id,
      websiteName: website.name,
      timestamp: new Date().toISOString(),
      status: Math.random() > 0.5 ? 200 : 500,
    }));
  };

  const incidents = generateSampleIncidents();

  if (!incidents.length) {
    return (
      <Alert severity="info">
        No incidents reported in the selected time range.
      </Alert>
    );
  }

  return (
    <List>
      {incidents.map((incident, index) => (
        <ListItem
          key={`${incident.websiteId}-${index}`}
          divider={index !== incidents.length - 1}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mb: 1,
            }}>
            <Typography variant="subtitle1" component="span">
              {incident.websiteName}
            </Typography>
            <Chip
              label={`Status ${incident.status}`}
              color={incident.status >= 400 ? "error" : "success"}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(incident.timestamp), "PPpp")}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};
