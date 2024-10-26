export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string | null
          name: string
          first_name: string | null
          last_name: string | null
          role: 'admin' | 'student'
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          email?: string | null
          name: string
          first_name?: string | null
          last_name?: string | null
          role?: 'admin' | 'student'
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string | null
          name?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'admin' | 'student'
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail: string | null
          created_at: string
          created_by: string
          students: number
          progress: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail?: string | null
          created_at?: string
          created_by: string
          students?: number
          progress?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail?: string | null
          created_at?: string
          created_by?: string
          students?: number
          progress?: number
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          order: number
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          order: number
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          order?: number
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          content: string
          video_url: string | null
          order: number
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          content: string
          video_url?: string | null
          order: number
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          content?: string
          video_url?: string | null
          order?: number
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          progress: number
          enrolled_at: string
          last_accessed: string | null
          grade: number | null
          has_certificate: boolean
          xp_earned: number
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          progress?: number
          enrolled_at?: string
          last_accessed?: string | null
          grade?: number | null
          has_certificate?: boolean
          xp_earned?: number
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          progress?: number
          enrolled_at?: string
          last_accessed?: string | null
          grade?: number | null
          has_certificate?: boolean
          xp_earned?: number
        }
      }
    }
  }
}