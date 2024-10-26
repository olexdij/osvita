import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Video, AlertTriangle, ExternalLink } from 'lucide-react';

interface LessonViewerProps {
  lesson: {
    title: string;
    content: string;
    videoUrl?: string | null;
    attachments?: string[];
  };
  completed: boolean;
  onComplete: () => void;
}

export function LessonViewer({ lesson, completed, onComplete }: LessonViewerProps) {
  const [showTranscript, setShowTranscript] = useState(false);

  const getEmbedUrl = (url: string) => {
    try {
      // Handle YouTube URLs
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be') 
          ? url.split('/').pop() 
          : new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      // Handle Vimeo URLs
      if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return url;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  const renderVideoContent = () => {
    if (!lesson.videoUrl) return null;

    const embedUrl = getEmbedUrl(lesson.videoUrl);
    if (!embedUrl) {
      return (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 p-6 text-center">
            <Video className="h-12 w-12 text-muted-foreground" />
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Invalid video URL format
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {lesson.videoUrl ? (
            <Video className="h-5 w-5 text-blue-500" />
          ) : (
            <FileText className="h-5 w-5 text-green-500" />
          )}
          {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {lesson.videoUrl && renderVideoContent()}

        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />

        {lesson.attachments && lesson.attachments.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Additional Resources</h3>
            <div className="grid gap-2">
              {lesson.attachments.map((attachment, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open(attachment, '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Resource {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={onComplete}
          disabled={completed}
          className="w-full"
        >
          {completed ? (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Completed
            </>
          ) : (
            'Mark as Complete'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}