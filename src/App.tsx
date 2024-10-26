import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CoursesPage } from "@/pages/courses";
import { SettingsPage } from "@/pages/settings";
import { SignInPage } from "@/pages/auth/sign-in";
import { SharedCoursePage } from "@/pages/courses/[courseId]";
import { StudentsPage } from "@/pages/students";
import { StudentProgressPage } from "@/pages/student/Progress";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="enum-theme">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/courses/:courseId" element={<SharedCoursePage />} />
            <Route path="/login" element={<SignInPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Admin routes */}
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Student routes */}
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/progress" element={<StudentProgressPage />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}