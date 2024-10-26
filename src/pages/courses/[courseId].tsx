import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { CourseViewer } from "@/components/courses/CourseViewer";
import { ShareCourseDialog } from "@/components/courses/ShareCourseDialog";
import { useAuth } from "@/lib/auth";

export function SharedCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [course, setCourse] = useState(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    // In a real app, fetch course data from your backend
    const fetchCourse = async () => {
      try {
        // Simulate API call
        const savedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
        const foundCourse = savedCourses.find(c => c.id === courseId);
        
        if (!foundCourse) {
          toast.error("Course not found");
          navigate("/courses");
          return;
        }

        setCourse(foundCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const handleStartCourse = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    try {
      // Update user profile with name
      await updateProfile({
        firstName,
        lastName
      });

      // Record course enrollment
      const enrollment = {
        userId: user?.id,
        courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        firstName,
        lastName
      };

      // In a real app, save to backend
      const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
      enrollments.push(enrollment);
      localStorage.setItem("enrollments", JSON.stringify(enrollments));

      toast.success("Successfully enrolled in course!");
      navigate(`/courses/${courseId}/learn`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in course");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container max-w-6xl py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <p className="text-muted-foreground mt-2">
                {course.description?.replace(/<[^>]*>/g, '')}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <img
                src={course.thumbnail}
                alt={course.title}
                className="rounded-lg object-cover w-full aspect-video"
              />
              <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {course.students} students enrolled
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Start Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleStartCourse}
                  >
                    Start Course
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <ShareCourseDialog
        courseId={courseId}
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />
    </div>
  );
}