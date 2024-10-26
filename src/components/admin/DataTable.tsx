import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recentActivities = [
  {
    user: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    course: "Advanced Web Development",
    progress: 85,
    status: "In Progress",
    lastActive: "2 hours ago",
  },
  {
    user: {
      name: "Michael Chen",
      email: "m.chen@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    course: "Data Science Fundamentals",
    progress: 100,
    status: "Completed",
    lastActive: "1 day ago",
  },
  {
    user: {
      name: "Emma Rodriguez",
      email: "emma.r@example.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    course: "UI/UX Design Principles",
    progress: 65,
    status: "In Progress",
    lastActive: "3 hours ago",
  },
];

export function DataTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentActivities.map((activity) => (
          <TableRow key={activity.user.email}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{activity.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{activity.course}</TableCell>
            <TableCell>{activity.progress}%</TableCell>
            <TableCell>
              <Badge variant={activity.status === "Completed" ? "default" : "secondary"}>
                {activity.status}
              </Badge>
            </TableCell>
            <TableCell>{activity.lastActive}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}