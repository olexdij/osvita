import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Certificate } from './Certificate';
import { LessonViewer } from './LessonViewer';
import { AssessmentViewer } from './AssessmentViewer';
import { CheckCircle, ChevronRight, Award, Play, Users, Clock, BookOpen, Share2, Maximize2, Minimize2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRealtimeCourse } from '@/hooks/use-realtime-course';
import { updateEnrollmentProgress } from '@/lib/supabase/db';

interface CourseViewerProps {
  course: any;
  onComplete?: () => void;
}

export function CourseViewer({ course, onComplete }: CourseViewerProps) {
  const { user } = useAuth();
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const { activeUsers, studentProgress } = useRealtimeCourse(course.id);

  // Initialize start time when component mounts
  useEffect(() => {
    setStartTime(new Date());
    return () => {
      if (startTime) {
        const endTime = new Date();
        const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        setTotalTimeSpent(prev => prev + timeSpent);
      }
    };
  }, []);

  const handleLessonComplete = async (lessonId: string) => {
    try {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);

      // Calculate new progress
      const totalLessons = course.modules.reduce(
        (acc: number, module: any) => acc + module.lessons.length,
        0
      );
      const progress = (newCompletedLessons.length / totalLessons) * 100;

      // Update progress in Supabase
      if (user) {
        await updateEnrollmentProgress(user.id, course.id, progress);
      }

      // Check if all lessons in the current module are completed
      const currentModule = course.modules[activeModuleIndex];
      const allModuleLessonsCompleted = currentModule.lessons.every(
        (lesson: any) => newCompletedLessons.includes(lesson.id)
      );

      if (allModuleLessonsCompleted) {
        if (currentModule.assessment) {
          setShowAssessment(true);
          toast.success("All lessons completed! Time for the module assessment.");
        } else {
          handleModuleComplete(currentModule.id);
        }
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error("Failed to complete lesson");
    }
  };

  const handleModuleComplete = async (moduleId: string) => {
    try {
      if (!completedModules.includes(moduleId)) {
        const newCompletedModules = [...completedModules, moduleId];
        setCompletedModules(newCompletedModules);
        setShowAssessment(false);

        // Calculate new progress
        const progress = (newCompletedModules.length / course.modules.length) * 100;

        // Update progress in Supabase
        if (user) {
          await updateEnrollmentProgress(user.id, course.id, progress);
        }

        if (newCompletedModules.length === course.modules.length) {
          setShowCertificate(true);
          onComplete?.();
          toast.success("Congratulations! You've completed the course!");
        } else {
          setActiveModuleIndex(activeModuleIndex + 1);
          toast.success("Module completed!");
        }
      }
    } catch (error) {
      console.error("Error completing module:", error);
      toast.error("Failed to complete module");
    }
  };

  // ... rest of the component remains the same ...
  
  return (
    <>
      <div className={`flex h-[calc(100vh-4rem)] ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/30">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{course.title}</h2>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{Math.round(progress)}% Complete</span>
                  <span>{activeUsers} active learners</span>
                </div>
              </div>
              
              {/* ... rest of the sidebar content remains the same ... */}
            </div>
          </ScrollArea>
        </div>

        {/* ... rest of the component remains the same ... */}
      </div>

      {/* ... dialogs remain the same ... */}
    </>
  );
}