import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LessonViewer } from './LessonViewer';
import { AssessmentViewer } from './AssessmentViewer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ModuleViewerProps {
  module: {
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      content: string;
      videoUrl?: string;
      attachments?: string[];
    }>;
    assessment?: {
      title: string;
      description: string;
      passingScore: number;
      questions: Array<{
        id: string;
        text: string;
        type: string;
        options?: string[];
        correctAnswer?: string;
        points: number;
      }>;
    };
  };
  onComplete: () => void;
}

export function ModuleViewer({ module, onComplete }: ModuleViewerProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }

    // If this was the last lesson and all lessons are completed
    if (currentLessonIndex === module.lessons.length - 1) {
      if (module.assessment) {
        // Move to assessment
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else {
        // Complete module if no assessment
        onComplete();
      }
    } else {
      // Move to next lesson
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handleAssessmentComplete = (passed: boolean) => {
    if (passed) {
      onComplete();
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (direction === 'next' && currentLessonIndex < module.lessons.length) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigation('prev')}
            disabled={currentLessonIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentLessonIndex < module.lessons.length
              ? `Lesson ${currentLessonIndex + 1} of ${module.lessons.length}`
              : 'Assessment'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigation('next')}
            disabled={
              currentLessonIndex === module.lessons.length ||
              !completedLessons.includes(module.lessons[currentLessonIndex]?.id)
            }
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {currentLessonIndex < module.lessons.length ? (
          <LessonViewer
            lesson={module.lessons[currentLessonIndex]}
            onComplete={() => handleLessonComplete(module.lessons[currentLessonIndex].id)}
          />
        ) : module.assessment ? (
          <AssessmentViewer
            assessment={module.assessment}
            onComplete={handleAssessmentComplete}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}