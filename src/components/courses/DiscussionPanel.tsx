import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { nanoid } from 'nanoid';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

export function DiscussionPanel({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Load comments from localStorage
    const savedComments = localStorage.getItem(`course-${courseId}-comments`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [courseId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: nanoid(),
      userId: user?.id || '',
      userName: user?.name || 'Anonymous',
      userAvatar: user?.avatar,
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`course-${courseId}-comments`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const handleLike = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    });
    setComments(updatedComments);
    localStorage.setItem(`course-${courseId}-comments`, JSON.stringify(updatedComments));
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="space-y-2">
        <Textarea
          placeholder="Share your thoughts or ask a question..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
          Post Comment
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={comment.userAvatar} />
                  <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(comment.id)}
                    >
                      👍 {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}