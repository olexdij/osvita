import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, Copy, GraduationCap, Trophy, UserPlus, MoreVertical, Pencil, Trash2, RotateCcw } from "lucide-react";
import { UsernameInput } from "@/components/students/UsernameInput";
import { PasswordInput } from "@/components/students/PasswordInput";
import { Badge } from "@/components/ui/badge";
import { StudentRankings } from "@/components/students/StudentRankings";

interface CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  lastAccessed: string;
  grade: number;
  hasCertificate: boolean;
  xpEarned: number;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  enrolledCourses: number;
  lastActive: string;
  status: "active" | "inactive";
  courses: CourseProgress[];
}

const defaultStudent: Omit<Student, 'id' | 'username' | 'password'> = {
  firstName: "",
  lastName: "",
  enrolledCourses: 0,
  lastActive: new Date().toISOString(),
  status: "active",
  courses: []
};

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem("students");
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      return parsed.map((student: any) => ({
        ...defaultStudent,
        ...student,
        courses: student.courses || []
      }));
    } catch (error) {
      console.error("Error loading students:", error);
      return [];
    }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const saveStudents = (newStudents: Student[]) => {
    try {
      localStorage.setItem("students", JSON.stringify(newStudents));
      setStudents(newStudents);
    } catch (error) {
      console.error("Error saving students:", error);
      toast.error("Failed to save students");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (students.some(s => s.username === formData.username)) {
      toast.error("Username already exists");
      return;
    }

    const newStudent: Student = {
      ...defaultStudent,
      id: crypto.randomUUID(),
      ...formData,
      lastActive: new Date().toISOString(),
    };

    saveStudents([...students, newStudent]);
    setIsDialogOpen(false);
    setFormData({ firstName: "", lastName: "", username: "", password: "" });
    toast.success("Student added successfully");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const updatedStudents = students.map(student => 
      student.id === selectedStudent.id 
        ? { 
            ...student, 
            firstName: formData.firstName,
            lastName: formData.lastName,
          }
        : student
    );

    saveStudents(updatedStudents);
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
    toast.success("Student updated successfully");
  };

  const handleDelete = () => {
    if (!selectedStudent) return;

    const updatedStudents = students.filter(student => student.id !== selectedStudent.id);
    saveStudents(updatedStudents);
    setIsDeleteDialogOpen(false);
    setSelectedStudent(null);
    toast.success("Student deleted successfully");
  };

  const handleResetProgress = () => {
    if (!selectedStudent) return;

    // Reset student's course progress
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        return {
          ...student,
          courses: student.courses.map(course => ({
            ...course,
            progress: 0,
            grade: 0,
            hasCertificate: false,
            xpEarned: 0,
            lastAccessed: new Date().toISOString()
          }))
        };
      }
      return student;
    });

    // Clear all course-related progress from localStorage
    const studentId = selectedStudent.id;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      // Clear course progress
      if (key.startsWith(`course-`) && key.includes(`-progress-${studentId}`)) {
        localStorage.removeItem(key);
      }
    });

    // Clear enrollments
    const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
    const updatedEnrollments = enrollments.filter(
      (e: any) => e.userId !== studentId
    );
    localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments));

    saveStudents(updatedStudents);
    setIsResetDialogOpen(false);
    setSelectedStudent(null);
    toast.success("Progress reset successfully");
  };

  const copyCredentials = async (student: Student) => {
    const loginUrl = window.location.origin + "/login";
    const credentials = `Login URL: ${loginUrl}
Username: ${student.username}
Password: ${student.password}`;

    try {
      await navigator.clipboard.writeText(credentials);
      setCopiedId(student.id);
      toast.success("Login credentials copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy credentials");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage student accounts and track progress
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <UsernameInput
                  value={formData.username}
                  onChange={(value) => setFormData({ ...formData, username: value })}
                  firstName={formData.firstName}
                  lastName={formData.lastName}
                  existingUsernames={students.map(s => s.username)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  value={formData.password}
                  onChange={(value) => setFormData({ ...formData, password: value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Add Student
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Student</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedStudent?.firstName} {selectedStudent?.lastName}? 
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Progress Dialog */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Course Progress</DialogTitle>
              <DialogDescription>
                Are you sure you want to reset all course progress for {selectedStudent?.firstName} {selectedStudent?.lastName}? 
                This will remove all completed lessons, grades, certificates, and XP points.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResetDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleResetProgress}
              >
                Reset Progress
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Student List
          </TabsTrigger>
          <TabsTrigger value="rankings" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Rankings & Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Enrolled Courses</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell>{student.enrolledCourses}</TableCell>
                      <TableCell>
                        {new Date(student.lastActive).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={student.status === "active" ? "default" : "secondary"}
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyCredentials(student)}
                                >
                                  {copiedId === student.id ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Copy login credentials
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setFormData({
                                    ...formData,
                                    firstName: student.firstName,
                                    lastName: student.lastName,
                                  });
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setIsResetDialogOpen(true);
                                }}
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No students found. Add your first student to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings">
          <StudentRankings students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
}