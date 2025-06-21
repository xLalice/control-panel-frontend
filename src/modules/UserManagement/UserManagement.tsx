import { useState } from "react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {  addUser, deleteUser, updateUser } from "../../api/api";
import { Plus, Users, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserList } from "./components/UserList";
import { UserForm } from "./components/UserForm";
import { User } from "@/types/sharedTypes";
import { UserFormData } from "./types";
import { selectUserHasPermission } from "@/store/slice/authSlice";
import { useAppSelector } from "@/store/store";
import { UserSkeleton } from "./components/UserSkeleton";
import { useUsersData } from "./hooks/useUsersData";

export default function UserManagementPage() {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const isAuthInitialized = useAppSelector(
    (state) => state.auth.isAuthInitialized
  );
  const canManageUsers = useAppSelector((state) =>
    selectUserHasPermission(state, "manage:users")
  );

  const {data: users = [], isLoading, error} = useUsersData();

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
      toast.success("User added successfully");
    },
    onError: (error) => {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserFormData }) =>
      updateUser(id, data),
    onSuccess: (response) => {
      queryClient.setQueryData<User[]>(["users"], (oldData = []) =>
        oldData.map((user) =>
          user.id === editingUserId ? response.updatedUser : user
        )
      );
      setIsDialogOpen(false);
      setEditingUserId(null);
      toast.success("User updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<User[]>(["users"], (oldData = []) =>
        oldData.filter((user) => user.id !== deletedId)
      );
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    },
  });

  const onSubmit = async (data: UserFormData) => {
    if (editingUserId) {
      updateUserMutation.mutate({ id: editingUserId, data });
    } else {
      addUserMutation.mutate(data);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingUserId(null);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <CardTitle className="text-red-600 mb-2">Error</CardTitle>
          <CardDescription>
            There was an error loading the users. Please try again later.
          </CardDescription>
        </Card>
      </div>
    );
  }

  const editingUser = editingUserId
    ? users.find((user: User) => user.id === editingUserId)
    : undefined;

  if (!isAuthInitialized) {
    return <UserSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage your organization's user accounts and permissions.
          </p>
        </div>
        {canManageUsers && (
          <Button
            onClick={handleAddNew}
            className="gap-2"
            disabled={addUserMutation.isPending}
          >
            {addUserMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users List
          </CardTitle>
          <CardDescription>
            A list of all users in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserList
            users={users}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            isUpdating={updateUserMutation.isPending}
            updatingId={updateUserMutation.variables?.id}
            isDeleting={deleteUserMutation.isPending}
            deletingId={deleteUserMutation.variables}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUserId ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUserId
                ? "Update user details below"
                : "Fill in the information for the new user"}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            defaultValues={editingUser}
            onSubmit={onSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={
              addUserMutation.isPending || updateUserMutation.isPending
            }
            isEditing={!!editingUserId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
