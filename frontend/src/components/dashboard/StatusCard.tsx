import { Card, CardContent, Typography, Box, SxProps } from "@mui/material";

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
  sx?: SxProps;
}

export const StatusCard = ({
  title,
  value,
  icon,
  subtitle,
  color,
  sx,
}: Props) => {
  return (
    <Card sx={{ height: "100%", ...sx }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h3"
          component="div"
          color={color || "inherit"}
          sx={{ mb: 1 }}>
          {value}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="body2" color={color || "textSecondary"}>
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
