import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin users get the admin dashboard layout
  if (profile.role === "admin") {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  }

  // Students get the student layout and can't access admin routes
  if (location.pathname.startsWith("/admin") || location.pathname === "/settings") {
    return <Navigate to="/courses" replace />;
  }

  return (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  );
}