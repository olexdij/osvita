import { supabase } from './supabase/client';
import type { Database } from './supabase/types';

type Tables = Database['public']['Tables'];

// Courses
export async function getAllCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select()
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCourse(id: string) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules:modules(
        *,
        lessons:lessons(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function saveCourse(courseData: Tables['courses']['Insert']) {
  const { data, error } = await supabase
    .from('courses')
    .upsert(courseData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Enrollments
export async function getEnrollmentsByUser(userId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function updateEnrollmentProgress(
  userId: string,
  courseId: string,
  progress: number
) {
  const { data, error } = await supabase
    .from('enrollments')
    .update({
      progress,
      last_accessed: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .select()
    .single();

  if (error) throw error;
  return data;
}