import { Edit2, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserSkeleton } from "./UserSkeleton";
import { User } from "../types";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  updatingId?: string;
  isDeleting: boolean;
  deletingId?: string;
}


const roleColors: Record<string, { bg: string; text: string }> = {
  ADMIN: { bg: "bg-red-100", text: "text-red-800" },
  SALES: { bg: "bg-green-100", text: "text-green-800" },
  MARKETING: { bg: "bg-purple-100", text: "text-purple-800" },
  LOGISTICS: { bg: "bg-orange-100", text: "text-orange-800" },
  ACCOUNTING: { bg: "bg-cyan-100", text: "text-cyan-800" },
};

export function UserList({
  users,
  isLoading,
  onEdit,
  onDelete,
  isUpdating,
  updatingId,
  isDeleting,
  deletingId,
}: UserListProps) {
  if (isLoading) {
    return <UserSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: User) => {
          // Get role name safely
          const roleName = user?.role?.name;
          // Get colors safely, provide defaults if role or name is missing
          const bgColor = roleName ? roleColors[roleName]?.bg : 'bg-gray-100'; // Default background
          const textColor = roleName ? roleColors[roleName]?.text : 'text-gray-800'; // Default text

          return (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name ?? 'N/A'}</TableCell> {/* Handle missing name too */}
              <TableCell>{user.email ?? 'N/A'}</TableCell> {/* Handle missing email */}
              <TableCell>
                {roleName ? (
                  <Badge className={`${bgColor} ${textColor}`}>
                    {roleName}
                  </Badge>
                ) : (
                  <Badge className={`${bgColor} ${textColor}`}>
                    No Role {/* Or N/A, or render nothing */}
                  </Badge>
                )}
              </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(user)}
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating && updatingId === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(user.id)}
                  disabled={isUpdating || isDeleting}
                >
                  {isDeleting && deletingId === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);
}