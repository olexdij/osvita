import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Award, Target } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  grade: number;
  xpEarned: number;
  hasCertificate: boolean;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  courses: CourseProgress[];
}

interface StudentRankingsProps {
  students: Student[];
}

export function StudentRankings({ students }: StudentRankingsProps) {
  // Calculate student rankings based on different criteria
  const calculateRankings = () => {
    return students.map(student => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      initials: `${student.firstName[0]}${student.lastName[0]}`,
      totalXP: (student.courses || []).reduce((sum, course) => sum + (course.xpEarned || 0), 0),
      averageGrade: student.courses?.length
        ? Math.round(
            student.courses.reduce((sum, course) => sum + (course.grade || 0), 0) /
              student.courses.length
          )
        : 0,
      completedCourses: (student.courses || []).filter(c => c.progress === 100).length,
      certificates: (student.courses || []).filter(c => c.hasCertificate).length,
    }));
  };

  const rankings = calculateRankings();

  // Sort rankings by different criteria
  const xpRankings = [...rankings].sort((a, b) => b.totalXP - a.totalXP);
  const gradeRankings = [...rankings].sort((a, b) => b.averageGrade - a.averageGrade);
  const completionRankings = [...rankings].sort((a, b) => b.completedCourses - a.completedCourses);
  const certificateRankings = [...rankings].sort((a, b) => b.certificates - a.certificates);

  const RankingList = ({ data, valueKey, icon: Icon, label }: any) => {
    const maxValue = Math.max(...data.map((s: any) => s[valueKey])) || 1;
    
    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {data.map((student: any, index: number) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                {index + 1}
              </div>
              <Avatar>
                <AvatarFallback>{student.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{student.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4" />
                  <span>{student[valueKey]} {label}</span>
                </div>
              </div>
              <Progress
                value={(student[valueKey] / maxValue) * 100}
                className="w-24 h-2"
              />
            </div>
          ))}
          {data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No ranking data available yet
            </div>
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="xp">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="xp" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              XP Rankings
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Grade Rankings
            </TabsTrigger>
            <TabsTrigger value="completion" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Course Completion
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="xp">
            <RankingList
              data={xpRankings}
              valueKey="totalXP"
              icon={Star}
              label="XP"
            />
          </TabsContent>

          <TabsContent value="grades">
            <RankingList
              data={gradeRankings}
              valueKey="averageGrade"
              icon={Target}
              label="%"
            />
          </TabsContent>

          <TabsContent value="completion">
            <RankingList
              data={completionRankings}
              valueKey="completedCourses"
              icon={Trophy}
              label="courses"
            />
          </TabsContent>

          <TabsContent value="certificates">
            <RankingList
              data={certificateRankings}
              valueKey="certificates"
              icon={Award}
              label="earned"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}