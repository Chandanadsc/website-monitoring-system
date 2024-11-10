import { useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { Website } from "../../types";

interface Props {
  websites: Website[];
  timeRange: "24h" | "7d" | "30d";
}

export const ResponseTimeChart = ({ websites, timeRange }: Props) => {
  const theme = useTheme();

  const generateSampleData = () => {
    const data: any[] = [];
    const now = Date.now();
    const points = 20;

    for (let i = points - 1; i >= 0; i--) {
      const point: any = {
        timestamp: now - i * 3600000,
      };

      websites.forEach((website) => {
        point[website.name] = Math.random() * 1000 + 100;
      });

      data.push(point);
    }

    return data;
  };

  const data = generateSampleData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => format(new Date(timestamp), "HH:mm")}
          type="number"
          domain={["auto", "auto"]}
        />
        <YAxis
          label={{
            value: "Response Time (ms)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          labelFormatter={(label) => format(new Date(label), "PPpp")}
          formatter={(value: number) => [
            `${value.toFixed(0)}ms`,
            "Response Time",
          ]}
        />
        <Legend />
        {websites.map((website, index) => (
          <Line
            key={website._id}
            type="monotone"
            dataKey={website.name}
            stroke={theme.palette.primary.main}
            dot={false}
            name={website.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
