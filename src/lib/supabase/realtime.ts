import { supabase } from './client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface SubscriptionCallbacks {
  onEnrollmentUpdate?: (payload: any) => void;
  onCourseUpdate?: (payload: any) => void;
  onProgressUpdate?: (payload: any) => void;
}

export class RealtimeSubscription {
  private channel: RealtimeChannel;
  private courseId: string;

  constructor(courseId: string, callbacks: SubscriptionCallbacks) {
    this.courseId = courseId;
    this.channel = supabase.channel(`course:${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enrollments',
          filter: `course_id=eq.${courseId}`
        },
        (payload) => callbacks.onEnrollmentUpdate?.(payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'courses',
          filter: `id=eq.${courseId}`
        },
        (payload) => callbacks.onCourseUpdate?.(payload)
      )
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const newState = this.channel.presenceState();
          callbacks.onProgressUpdate?.(newState);
        }
      );
  }

  async subscribe() {
    const status = await this.channel.subscribe();
    if (status !== 'SUBSCRIBED') {
      throw new Error('Failed to subscribe to real-time updates');
    }
  }

  async track(userId: string, progress: number) {
    await this.channel.track({
      user_id: userId,
      progress,
      online_at: new Date().toISOString(),
    });
  }

  unsubscribe() {
    supabase.removeChannel(this.channel);
  }
}

export function subscribeToUserEnrollments(
  userId: string,
  onUpdate: (payload: any) => void
) {
  return supabase
    .channel('enrollments')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'enrollments',
        filter: `user_id=eq.${userId}`
      },
      onUpdate
    )
    .subscribe();
}

export function subscribeToCoursesUpdates(onUpdate: (payload: any) => void) {
  return supabase
    .channel('courses')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'courses'
      },
      onUpdate
    )
    .subscribe();
}