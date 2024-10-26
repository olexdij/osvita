import { supabase } from './client';
import { nanoid } from 'nanoid';
import { Database } from './types';

type Tables = Database['public']['Tables'];

// Users
export async function createUser(userData: Tables['users']['Insert']) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      ...userData,
      id: nanoid(),
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Courses
export async function createCourse(courseData: Tables['courses']['Insert']) {
  const { data, error } = await supabase
    .from('courses')
    .insert({
      ...courseData,
      id: nanoid(),
      created_at: new Date().toISOString()
    })
    .select()
    .single();

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

export async function getAllCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select()
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Enrollments
export async function createEnrollment(enrollmentData: Tables['enrollments']['Insert']) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      ...enrollmentData,
      id: nanoid(),
      enrolled_at: new Date().toISOString()
    })
    .select()
    .single();

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

export async function getStudentEnrollments(userId: string) {
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

// Modules and Lessons
export async function createModule(moduleData: Tables['modules']['Insert']) {
  const { data, error } = await supabase
    .from('modules')
    .insert({
      ...moduleData,
      id: nanoid()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createLesson(lessonData: Tables['lessons']['Insert']) {
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      ...lessonData,
      id: nanoid()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}