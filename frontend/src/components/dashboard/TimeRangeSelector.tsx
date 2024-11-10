import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TimeRangeSelector = ({ value, onChange }: Props) => {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Time Range</InputLabel>
      <Select
        value={value}
        label="Time Range"
        onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="24h">Last 24 Hours</MenuItem>
        <MenuItem value="7d">Last 7 Days</MenuItem>
        <MenuItem value="30d">Last 30 Days</MenuItem>
      </Select>
    </FormControl>
  );
};
