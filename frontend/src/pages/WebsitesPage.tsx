import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useWebsites } from "../hooks/useWebsites";
import { WebsiteList } from "../components/WebsiteList";
import { AddWebsiteDialog } from "../components/AddWebsiteDialog";
import { Website } from "../types";

export const WebsitesPage = () => {
  const { data: websites, isLoading, error } = useWebsites();
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddClick = () => {
    setSelectedWebsite(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (website: Website) => {
    setSelectedWebsite(website);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedWebsite(null);
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load websites. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography variant="h4" component="h1">
          Monitored Websites
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}>
          Add Website
        </Button>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
          <CircularProgress />
        </Box>
      ) : !websites?.length ? (
        <Alert severity="info">
          No websites added yet. Click the Add Website button to get started.
        </Alert>
      ) : (
        <WebsiteList websites={websites} onEdit={handleEditClick} />
      )}

      <AddWebsiteDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        website={selectedWebsite}
      />
    </Container>
  );
};
