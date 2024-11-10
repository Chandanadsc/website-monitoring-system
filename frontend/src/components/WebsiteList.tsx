import { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Website } from "../types";
import { useDeleteWebsite } from "../hooks/useWebsites";

interface Props {
  websites: Website[];
  onEdit: (website: Website) => void;
}

export const WebsiteList = ({ websites, onEdit }: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState<Website | null>(null);
  const deleteWebsite = useDeleteWebsite();

  const handleDeleteClick = (website: Website) => {
    setWebsiteToDelete(website);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (websiteToDelete) {
      try {
        await deleteWebsite.mutateAsync(websiteToDelete._id);
        setDeleteDialogOpen(false);
        setWebsiteToDelete(null);
      } catch (error) {
        // Error handling is done in the mutation
      }
    }
  };

  return (
    <>
      <List>
        {websites.map((website) => (
          <ListItem
            key={website._id}
            divider
            secondaryAction={
              <>
                <Tooltip title="Edit">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => onEdit(website)}
                    sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteClick(website)}
                    color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            }>
            <ListItemText
              primary={website.name}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    {website.url}
                  </Typography>
                  <br />
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary">
                    Check interval: {website.checkInterval} minutes
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {websiteToDelete?.name}? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteWebsite.isLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
