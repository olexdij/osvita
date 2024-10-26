import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email'),
  name: text('name').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role', { enum: ['admin', 'student'] }).notNull().default('student'),
  password: text('password').notNull(),
  createdAt: text('created_at').notNull()
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail'),
  createdAt: text('created_at').notNull(),
  createdBy: text('created_by').references(() => users.id),
  students: integer('students').notNull().default(0),
  progress: real('progress').notNull().default(0)
});

export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id).notNull(),
  title: text('title').notNull(),
  order: integer('order').notNull()
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').references(() => modules.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  videoUrl: text('video_url'),
  order: integer('order').notNull()
});

export const assessments = sqliteTable('assessments', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').references(() => modules.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  passingScore: integer('passing_score').notNull().default(70)
});

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').references(() => assessments.id).notNull(),
  text: text('text').notNull(),
  type: text('type', { enum: ['multiple-choice', 'essay'] }).notNull(),
  options: text('options'),
  correctAnswer: text('correct_answer'),
  points: integer('points').notNull().default(10),
  order: integer('order').notNull()
});

export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  courseId: text('course_id').references(() => courses.id).notNull(),
  progress: real('progress').notNull().default(0),
  enrolledAt: text('enrolled_at').notNull(),
  lastAccessed: text('last_accessed'),
  grade: real('grade'),
  hasCertificate: integer('has_certificate', { mode: 'boolean' }).notNull().default(false),
  xpEarned: integer('xp_earned').notNull().default(0)
});

export const lessonProgress = sqliteTable('lesson_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  lessonId: text('lesson_id').references(() => lessons.id).notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  completedAt: text('completed_at')
});

export const assessmentResults = sqliteTable('assessment_results', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  assessmentId: text('assessment_id').references(() => assessments.id).notNull(),
  score: real('score').notNull(),
  passed: integer('passed', { mode: 'boolean' }).notNull(),
  completedAt: text('completed_at').notNull()
});