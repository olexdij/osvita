import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Track your platform's performance and student engagement
          </p>
        </div>
        <Select defaultValue="7">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={[
                { name: "Mon", value: 240 },
                { name: "Tue", value: 320 },
                { name: "Wed", value: 280 },
                { name: "Thu", value: 360 },
                { name: "Fri", value: 400 },
                { name: "Sat", value: 280 },
                { name: "Sun", value: 240 },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={[
                { name: "AI Basics", value: 85 },
                { name: "Web Dev", value: 92 },
                { name: "Data Science", value: 78 },
                { name: "Python", value: 88 },
                { name: "UX Design", value: 76 },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}