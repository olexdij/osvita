import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";

interface ChartProps {
  data: any[];
  categories: string[];
  index: string;
  title?: string;
  description?: string;
  className?: string;
}

export function LineChart({ data, categories, index, className }: ChartProps) {
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={index}
            style={{ fontSize: "12px" }}
          />
          <YAxis style={{ fontSize: "12px" }} />
          <Tooltip />
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({ data, categories, index, className }: ChartProps) {
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={index}
            style={{ fontSize: "12px" }}
          />
          <YAxis style={{ fontSize: "12px" }} />
          <Tooltip />
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}