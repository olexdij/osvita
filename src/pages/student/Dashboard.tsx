import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Trophy, Target, Play } from "lucide-react";

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // In a real app, fetch this from your backend
  const enrolledCourses = JSON.parse(localStorage.getItem("enrollments") || "[]")
    .filter((enrollment: any) => enrollment.userId === user?.id);

  const stats = [
    {
      title: "Courses In Progress",
      value: enrolledCourses.length,
      description: "Active enrollments",
      icon: BookOpen,
    },
    {
      title: "Total Study Time",
      value: "12h 30m",
      description: "This month",
      icon: Clock,
    },
    {
      title: "Completion Rate",
      value: "85%",
      description: "+5% from last month",
      icon: Trophy,
    },
    {
      title: "Learning Goals",
      value: "4/5",
      description: "On track",
      icon: Target,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || user?.name}!
        </h2>
        <p className="text-muted-foreground">
          Track your progress and continue learning
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((enrollment: any) => (
                    <div
                      key={enrollment.courseId}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{enrollment.courseTitle}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          Last accessed {new Date(enrollment.lastAccessed || enrollment.enrolledAt).toLocaleDateString()}
                        </div>
                        <Progress value={enrollment.progress || 0} className="mt-2" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/courses/${enrollment.courseId}`)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No courses enrolled yet.</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/courses")}
                    className="mt-2"
                  >
                    Browse Courses
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {[
                  {
                    title: "Complete React Fundamentals",
                    progress: 65,
                    dueDate: "2024-03-30",
                  },
                  {
                    title: "Build 3 Projects",
                    progress: 33,
                    dueDate: "2024-04-15",
                  },
                  {
                    title: "Study 10 Hours/Week",
                    progress: 80,
                    dueDate: "2024-03-25",
                  },
                ].map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">{goal.title}</p>
                      <span className="text-sm text-muted-foreground">
                        Due {new Date(goal.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}