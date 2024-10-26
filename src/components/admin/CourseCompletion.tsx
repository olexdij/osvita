import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const courseCompletions = [
  {
    title: "Advanced Web Development",
    enrolled: 245,
    completed: 198,
    satisfaction: 94,
  },
  {
    title: "Data Science Fundamentals",
    enrolled: 189,
    completed: 145,
    satisfaction: 88,
  },
  {
    title: "UI/UX Design Principles",
    enrolled: 167,
    completed: 134,
    satisfaction: 92,
  },
  {
    title: "Mobile App Development",
    enrolled: 203,
    completed: 178,
    satisfaction: 96,
  },
];

export function CourseCompletion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {courseCompletions.map((course) => (
              <div key={course.title} className="space-y-2">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.completed} of {course.enrolled} students completed
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {course.satisfaction}%
                  </div>
                </div>
                <Progress 
                  value={(course.completed / course.enrolled) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}