import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, BarChart } from "@/components/ui/chart";
import { useState } from "react";
import { Users, BookOpen, Trophy, Target } from "lucide-react";

// Sample data - replace with actual API calls in production
const userProgressData = [
  { date: "Jan", completions: 45, enrollments: 120, activeUsers: 89 },
  { date: "Feb", completions: 78, enrollments: 145, activeUsers: 102 },
  { date: "Mar", completions: 125, enrollments: 180, activeUsers: 134 },
  { date: "Apr", completions: 156, enrollments: 210, activeUsers: 156 },
];

const courseStats = [
  {
    id: 1,
    title: "Lean Manufacturing Excellence",
    enrolled: 245,
    completed: 182,
    avgScore: 88,
    satisfaction: 4.5,
  },
  {
    id: 2,
    title: "Digital Marketing Fundamentals",
    enrolled: 189,
    completed: 145,
    avgScore: 92,
    satisfaction: 4.8,
  },
  {
    id: 3,
    title: "Project Management Essentials",
    enrolled: 167,
    completed: 134,
    avgScore: 85,
    satisfaction: 4.3,
  },
];

const topPerformers = [
  {
    id: 1,
    name: "Sarah Johnson",
    coursesCompleted: 12,
    avgScore: 95,
    totalHours: 156,
  },
  {
    id: 2,
    name: "Michael Chen",
    coursesCompleted: 10,
    avgScore: 92,
    totalHours: 134,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    coursesCompleted: 9,
    avgScore: 90,
    totalHours: 128,
  },
];

const stats = [
  {
    title: "Total Users",
    value: "2,834",
    description: "+18% from last month",
    icon: Users,
  },
  {
    title: "Active Courses",
    value: "156",
    description: "+12 new this month",
    icon: BookOpen,
  },
  {
    title: "Completion Rate",
    value: "76%",
    description: "+5% improvement",
    icon: Trophy,
  },
  {
    title: "Learning Goals Met",
    value: "89%",
    description: "Above target",
    icon: Target,
  },
];

export function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("30");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Statistics</h2>
          <p className="text-muted-foreground">
            Comprehensive overview of platform performance and user engagement
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
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

      {/* Key Metrics */}
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

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={userProgressData}
              categories={["completions", "enrollments", "activeUsers"]}
              index="date"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={courseStats.map(course => ({
                name: course.title.substring(0, 20) + "...",
                value: Math.round((course.completed / course.enrolled) * 100)
              }))}
              index="name"
              categories={["value"]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Course Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead className="text-right">Enrolled</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">Avg. Score</TableHead>
                <TableHead className="text-right">Satisfaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseStats.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell className="text-right">{course.enrolled}</TableCell>
                  <TableCell className="text-right">{course.completed}</TableCell>
                  <TableCell className="text-right">{course.avgScore}%</TableCell>
                  <TableCell className="text-right">{course.satisfaction}/5.0</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead className="text-right">Courses Completed</TableHead>
                <TableHead className="text-right">Average Score</TableHead>
                <TableHead className="text-right">Total Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-right">{user.coursesCompleted}</TableCell>
                  <TableCell className="text-right">{user.avgScore}%</TableCell>
                  <TableCell className="text-right">{user.totalHours}h</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}