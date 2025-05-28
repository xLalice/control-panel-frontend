import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserFormProps, UserFormData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api";

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  role: z.object({
    id: z.number(),
    name: z.string()
  }, { required_error: "Role is required" }),
});

export function UserForm({
  defaultValues = {},
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
}: UserFormProps) {
  const { data: roles } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await apiClient.get("/users/roles");
      return response.data;
    },
  });

  // Transform defaultValues to match our form structure
  const transformedDefaults: Partial<UserFormData> = {
    ...defaultValues,
    // If role is provided as an object, extract the id as a string for the form
    role: defaultValues.role ? {
      id: defaultValues.role.id,
      name: defaultValues.role.name
    } : undefined
  };

  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: { id: 0, name: "" },
      ...transformedDefaults,
    },
  });

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
                  placeholder={
                    isEditing
                      ? "Leave blank to keep current password"
                      : "Enter password"
                  }
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
              <FormLabel className="flex items-center gap-1">
                Role <span className="text-red-500">*</span>
              </FormLabel>
              <Select 
                onValueChange={(value) => {
                  // Find the selected role from the roles array
                  const selectedRole = roles?.find(r => r.id.toString() === value);
                  if (selectedRole) {
                    // Update the form with the complete role object
                    field.onChange({ id: selectedRole.id, name: selectedRole.name });
                  }
                }} 
                defaultValue={field.value?.id?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role">
                      {field.value?.name}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!roles ? (
                    <SelectItem value="loading" disabled>
                      Loading roles...
                    </SelectItem>
                  ) : roles.length === 0 ? (
                    <SelectItem value="no-roles" disabled>
                      No roles found
                    </SelectItem>
                  ) : (
                    roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))
                  )}
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
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isEditing ? "Update User" : "Add User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}