import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  GraduationCap, 
  Star, 
  Award,
  Clock,
  Target,
  BookOpen
} from "lucide-react";

interface CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  lastAccessed: string;
  grade: number;
  hasCertificate: boolean;
  xpEarned: number;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  courses: CourseProgress[];
}

interface StudentStatsProps {
  student: Student;
}

export function StudentStats({ student }: StudentStatsProps) {
  const courses = student?.courses || [];
  
  const totalXP = courses.reduce((acc, course) => acc + course.xpEarned, 0);
  const certificatesEarned = courses.filter(course => course.hasCertificate).length;
  const averageGrade = courses.length
    ? Math.round(courses.reduce((acc, course) => acc + course.grade, 0) / courses.length)
    : 0;
  const completedCourses = courses.filter(course => course.progress === 100).length;

  const stats = [
    {
      title: "Total XP",
      value: totalXP.toLocaleString(),
      icon: Star,
      description: "Experience points earned"
    },
    {
      title: "Certificates",
      value: certificatesEarned,
      icon: Award,
      description: "Certificates earned"
    },
    {
      title: "Average Grade",
      value: `${averageGrade}%`,
      icon: Target,
      description: "Across all courses"
    },
    {
      title: "Course Completion",
      value: `${completedCourses}/${courses.length}`,
      icon: BookOpen,
      description: "Courses completed"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Course Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.courseId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{course.courseName}</span>
                        {course.hasCertificate && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Certified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {course.grade}% Grade
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {course.xpEarned} XP
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(course.lastAccessed).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={course.progress} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No courses enrolled yet
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}