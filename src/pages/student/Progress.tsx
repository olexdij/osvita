import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { StudentStats } from "@/components/students/StudentStats";

export function StudentProgressPage() {
  const { user } = useAuth();

  // Get student data from localStorage
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const studentData = students.find((s: any) => s.id === user?.id);

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Progress</h2>
        <p className="text-muted-foreground">
          Track your OSVITA learning journey and achievements
        </p>
      </div>

      <Card>
        <StudentStats student={studentData} />
      </Card>
    </div>
  );
}