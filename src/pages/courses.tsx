import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { CourseForm } from "@/components/courses/CourseForm";
import { CourseCard } from "@/components/courses/CourseCard";
import { AICourseMaker } from "@/components/courses/AICourseMaker";
import { toast } from "sonner";
import { getAllCourses, saveCourse, deleteCourse } from "@/lib/db";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  modules: any[];
  students: number;
  progress: number;
  createdAt: string;
}

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsRefreshing(true);
      const loadedCourses = await getAllCourses();
      setCourses(loadedCourses.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreateCourse = async (courseData: Course) => {
    try {
      await saveCourse(courseData);
      await loadCourses();
      setIsDialogOpen(false);
      toast.success("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    }
  };

  const handleUpdateCourse = async (courseData: Course) => {
    try {
      await saveCourse(courseData);
      await loadCourses();
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(courseId);
        await loadCourses();
        toast.success("Course deleted successfully!");
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleAIGenerated = async (courseData: Course) => {
    try {
      await saveCourse(courseData);
      await loadCourses();
      setShowAIGenerator(false);
      toast.success("AI-generated course created successfully!");
    } catch (error) {
      console.error("Error saving AI-generated course:", error);
      toast.error("Failed to save AI-generated course");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Create and manage your learning content
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadCourses}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Refresh
          </Button>

          <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
            <DialogTrigger asChild>
              <Button variant="outline">
                AI Generate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] p-0">
              <DialogHeader className="px-4 py-2">
                <DialogTitle>Generate Course with AI</DialogTitle>
              </DialogHeader>
              <AICourseMaker onCourseGenerated={handleAIGenerated} />
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <CourseForm onSubmit={handleCreateCourse} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onDelete={handleDeleteCourse}
            onUpdate={handleUpdateCourse}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses yet. Create your first course!</p>
        </div>
      )}
    </div>
  );
}