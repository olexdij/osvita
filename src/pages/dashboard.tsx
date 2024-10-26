import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, BookOpen, Trophy } from "lucide-react";

const stats = [
  {
    title: "Active Courses",
    value: "12",
    icon: BookOpen,
    description: "3 courses in progress"
  },
  {
    title: "Total Students",
    value: "2,834",
    icon: Users,
    description: "+18% from last month"
  },
  {
    title: "Completion Rate",
    value: "87%",
    icon: Trophy,
    description: "+5% from last month"
  },
  {
    title: "Average Score",
    value: "92%",
    icon: BarChart2,
    description: "+2% from last month"
  }
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your learning platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}