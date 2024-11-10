import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Website } from "../types";
import { useAddWebsite, useUpdateWebsite } from "../hooks/useWebsites";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  url: yup.string().url("Must be a valid URL").required("URL is required"),
  checkInterval: yup
    .number()
    .min(1, "Must be at least 1 minute")
    .required("Check interval is required"),
});

interface Props {
  open: boolean;
  onClose: () => void;
  website?: Website | null;
}

export const WebsiteDialog = ({ open, onClose, website }: Props) => {
  const addWebsite = useAddWebsite();
  const updateWebsite = useUpdateWebsite();
  const isEditing = !!website;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: website || {
      name: "",
      url: "",
      checkInterval: 5,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEditing && website) {
        await updateWebsite.mutateAsync({ id: website._id, ...data });
      } else {
        await addWebsite.mutateAsync(data);
      }
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditing ? "Edit Website" : "Add New Website"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              {...register("name")}
              label="Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register("url")}
              label="URL"
              fullWidth
              error={!!errors.url}
              helperText={errors.url?.message}
            />
            <TextField
              {...register("checkInterval")}
              label="Check Interval (minutes)"
              type="number"
              fullWidth
              error={!!errors.checkInterval}
              helperText={errors.checkInterval?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={addWebsite.isLoading || updateWebsite.isLoading}>
            {isEditing ? "Save Changes" : "Add Website"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
