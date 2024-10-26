import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileEdit, Trash2, Award, Play, Users, Clock, BookOpen, Share2 } from "lucide-react";
import { CourseForm } from "./CourseForm";
import { Certificate } from "./Certificate";
import { CourseViewer } from "./CourseViewer";
import { Progress } from "@/components/ui/progress";
import { ShareCourseDialog } from "./ShareCourseDialog";
import { useState } from "react";

export function CourseCard({ course, onDelete, onUpdate }) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <img
        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"}
        alt={course.title}
        className="h-48 w-full object-cover transition-transform group-hover:scale-105"
      />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-xl">{course.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Play className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{course.title}</DialogTitle>
                </DialogHeader>
                <CourseViewer course={course} onComplete={() => {}} />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <FileEdit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Course</DialogTitle>
                </DialogHeader>
                <CourseForm initialData={course} onSubmit={onUpdate} />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Award className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Course Certificate</DialogTitle>
                </DialogHeader>
                <Certificate course={course} />
              </DialogContent>
            </Dialog>
            
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDelete(course.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description.replace(/<[^>]*>/g, ' ').trim()}
        </p>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center gap-1 text-center">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{course.students}</span>
            <span className="text-xs text-muted-foreground">Students</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{course.modules?.length || 0}</span>
            <span className="text-xs text-muted-foreground">Modules</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0}
            </span>
            <span className="text-xs text-muted-foreground">Lessons</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
      </CardContent>

      <ShareCourseDialog
        courseId={course.id}
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />
    </Card>
  );
}