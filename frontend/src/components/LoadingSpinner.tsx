import { Box, CircularProgress, Typography } from "@mui/material";

interface Props {
  message?: string;
}

export const LoadingSpinner = ({ message = "Loading..." }: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      gap={2}>
      <CircularProgress />
      <Typography color="textSecondary">{message}</Typography>
    </Box>
  );
};
