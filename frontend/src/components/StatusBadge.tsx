import { Chip, ChipProps } from "@mui/material";

interface Props extends Omit<ChipProps, "color"> {
  status: "up" | "down" | "pending";
}

export const StatusBadge = ({ status, ...props }: Props) => {
  const getColor = () => {
    switch (status) {
      case "up":
        return "success";
      case "down":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Chip
      {...props}
      color={getColor()}
      label={status.toUpperCase()}
      size="small"
    />
  );
};
