import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseViewer } from "@/components/courses/CourseViewer";
import { StudyTimer } from "@/components/courses/StudyTimer";
import { DiscussionPanel } from "@/components/courses/DiscussionPanel";
import { ResourceLibrary } from "@/components/courses/ResourceLibrary";
import { ProgressReport } from "@/components/courses/ProgressReport";
import { useAuth } from "@/lib/auth";

export function StudentCourseView() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);

  useEffect(() => {
    // In a real app, fetch from your backend
    const savedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    const foundCourse = savedCourses.find((c: any) => c.id === courseId);
    setCourse(foundCourse);

    const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
    const foundEnrollment = enrollments.find(
      (e: any) => e.courseId === courseId && e.userId === user?.id
    );
    setEnrollment(foundEnrollment);
  }, [courseId, user?.id]);

  if (!course || !enrollment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_300px]">
            <CourseViewer
              course={course}
              onComplete={() => {
                // Update progress
                const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
                const updatedEnrollments = enrollments.map((e: any) =>
                  e.courseId === courseId && e.userId === user?.id
                    ? { ...e, progress: 100, lastAccessed: new Date().toISOString() }
                    : e
                );
                localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments));
              }}
            />
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <StudyTimer />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <ProgressReport
            courseId={courseId}
            progress={enrollment.progress || 0}
            timeSpent={120}
            completedLessons={3}
            totalLessons={10}
            learningStreak={5}
            quizScores={[85, 90, 95]}
          />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceLibrary />
        </TabsContent>

        <TabsContent value="discussion">
          <Card>
            <CardContent className="p-6">
              <DiscussionPanel courseId={courseId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}