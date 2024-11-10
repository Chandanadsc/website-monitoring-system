import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddWebsite } from "../hooks/useWebsites";
import { Website } from "../types";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  url: yup.string().url("Must be a valid URL").required("URL is required"),
  description: yup.string(),
  checkInterval: yup.number().min(1).max(60).default(5),
});

interface Props {
  open: boolean;
  onClose: () => void;
  website: Website | null;
}

export const AddWebsiteDialog = ({ open, onClose, website }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const addWebsite = useAddWebsite();

  const onSubmit = async (data: any) => {
    await addWebsite.mutateAsync(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Website</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            {...register("name")}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            {...register("url")}
            label="URL"
            fullWidth
            margin="normal"
            error={!!errors.url}
            helperText={errors.url?.message}
          />
          <TextField
            {...register("description")}
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            {...register("checkInterval")}
            label="Check Interval (minutes)"
            type="number"
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { min: 1, max: 60 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
