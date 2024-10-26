import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userProgress = [
  {
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    coursesCompleted: 5,
    totalCourses: 8,
    averageScore: 92,
  },
  {
    user: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    coursesCompleted: 3,
    totalCourses: 5,
    averageScore: 88,
  },
  {
    user: {
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    coursesCompleted: 7,
    totalCourses: 7,
    averageScore: 95,
  },
];

export function UserProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Users</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {userProgress.map((progress) => (
              <div key={progress.user.name} className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={progress.user.avatar} alt={progress.user.name} />
                    <AvatarFallback>{progress.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{progress.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {progress.coursesCompleted} of {progress.totalCourses} courses completed
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {progress.averageScore}%
                  </div>
                </div>
                <Progress value={(progress.coursesCompleted / progress.totalCourses) * 100} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}