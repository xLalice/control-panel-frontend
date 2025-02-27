import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, addUser, deleteUser, updateUser } from "../../api/api";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit2, Trash2, Plus, Users, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const roleColors: Record<string, { bg: string; text: string }> = {
  ADMIN: { bg: "bg-red-100", text: "text-red-800" },
  SALES: { bg: "bg-green-100", text: "text-green-800" },
  MARKETING: { bg: "bg-purple-100", text: "text-purple-800" },
  LOGISTICS: { bg: "bg-orange-100", text: "text-orange-800" },
  ACCOUNTING: { bg: "bg-cyan-100", text: "text-cyan-800" },
};

export default function UserManagementPage() {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<UserFormData>();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetchUsers();
      return response.data;
    },
  });

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: (response) => {
      queryClient.setQueryData<User[]>(["users"], (oldData = []) => [
        ...oldData,
        response.newUser,
      ]);
      setIsDialogOpen(false);
      form.reset();
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
      form.reset();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<User[]>(["users"], (oldData = []) =>
        oldData.filter((user) => user.id !== deletedId)
      );
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
    form.setValue("name", user.name);
    form.setValue("email", user.email);
    form.setValue("password", "");
    form.setValue("role", user.role);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingUserId(null);
    form.reset();
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage your organization's user accounts and permissions.
          </p>
        </div>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${roleColors[user.role]?.bg} ${
                          roleColors[user.role]?.text
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                          disabled={updateUserMutation.isPending}
                        >
                          {updateUserMutation.isPending && 
                           updateUserMutation.variables?.id === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          {deleteUserMutation.isPending && 
                           deleteUserMutation.variables === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SALES">Sales</SelectItem>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                        <SelectItem value="LOGISTICS">Logistics</SelectItem>
                        <SelectItem value="ACCOUNTING">Accounting</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={addUserMutation.isPending || updateUserMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addUserMutation.isPending || updateUserMutation.isPending}
                >
                  {(addUserMutation.isPending || updateUserMutation.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {editingUserId ? "Update User" : "Add User"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}