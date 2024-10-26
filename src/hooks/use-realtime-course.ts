import { useState, useEffect } from 'react';
import { RealtimeSubscription } from '@/lib/supabase/realtime';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export function useRealtimeCourse(courseId: string) {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [studentProgress, setStudentProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!courseId || !user) return;

    let subscription: RealtimeSubscription;

    const initializeRealtime = async () => {
      try {
        subscription = new RealtimeSubscription(courseId, {
          onEnrollmentUpdate: (payload) => {
            if (payload.eventType === 'UPDATE') {
              const { progress, user_id } = payload.new;
              setStudentProgress((prev) => ({
                ...prev,
                [user_id]: progress
              }));

              if (user_id === user.id) {
                toast.success('Progress updated');
              }
            }
          },
          onCourseUpdate: (payload) => {
            if (payload.eventType === 'UPDATE') {
              const { students } = payload.new;
              toast.info(`${students} students enrolled`);
            }
          },
          onProgressUpdate: (presenceState) => {
            const users = Object.values(presenceState).flat();
            setActiveUsers(users.length);
            
            users.forEach((presence: any) => {
              setStudentProgress((prev) => ({
                ...prev,
                [presence.user_id]: presence.progress
              }));
            });
          }
        });

        await subscription.subscribe();
        
        // Track current user's presence
        if (user) {
          await subscription.track(user.id, studentProgress[user.id] || 0);
        }
      } catch (error) {
        console.error('Error initializing realtime:', error);
        toast.error('Failed to connect to real-time updates');
      }
    };

    initializeRealtime();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [courseId, user]);

  return {
    activeUsers,
    studentProgress
  };
}