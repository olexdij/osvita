import { BarChart, LineChart } from "@/components/ui/chart";

interface AnalyticsData {
  date: string;
  users: number;
  courses: number;
  completions: number;
}

const analyticsData: AnalyticsData[] = [
  {
    date: "Jan 2024",
    users: 150,
    courses: 12,
    completions: 45,
  },
  {
    date: "Feb 2024",
    users: 220,
    courses: 15,
    completions: 78,
  },
  {
    date: "Mar 2024",
    users: 310,
    courses: 18,
    completions: 125,
  },
];

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <LineChart
        title="Growth Trends"
        description="Monthly user and course growth"
        data={analyticsData}
        categories={["users", "courses"]}
        index="date"
        className="w-full"
      />
      <BarChart
        title="Course Completions"
        description="Monthly course completion rates"
        data={analyticsData}
        categories={["completions"]}
        index="date"
        className="w-full"
      />
    </div>
  );
}