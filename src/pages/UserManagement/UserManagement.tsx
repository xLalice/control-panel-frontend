import { useState, useEffect } from "react";
import { fetchUsers, addUser, deleteUser, updateUser } from "../../api/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { User } from "../../types";

type UserFormData = Omit<User, "id">;

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    role: yup.string().required("Role is required"),
  })
  .required();

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      }
    }

    fetchData();
  }, []);

  // Handle adding/updating a user
  const onSubmit = async (data: UserFormData) => {
    if (editingUserId) {
      try {
        const response = await updateUser(editingUserId, data);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUserId ? response.updatedUser : user
          )
        );
        toast.success("User updated successfully!");
        setEditingUserId(null);
        reset();
      } catch (error) {
        toast.error("Error updating user.");
        console.error("Error updating user:", error);
      }
    } else {
      try {
        const response = await addUser(data);
        setUsers((prevUsers) => [...prevUsers, response.newUser]);
        toast.success("User added successfully!");
        reset();
      } catch (error) {
        toast.error("Error adding user.");
        console.error("Error adding user:", error);
      }
    }
  };

  // Handle editing a user
  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    // Pre-fill the form with the user's data
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("password", ""); // Do not prefill password for security
    setValue("role", user.role);
  };

  // Handle deleting a user
  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Error deleting user.");
      console.error("Error deleting user:", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUserId(null);
    reset(); // Clear form
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        User Management
      </h1>

      {/* Add/Edit User Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingUserId ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter name"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-indigo-500"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-600"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              {...register("role")}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="SALES">Sales</option>
              <option value="MARKETING">Marketing</option>
              <option value="LOGISTICS">Logistics</option>
              <option value="ACCOUNTING">Accounting</option>
            </select>
            {errors.role && (
              <span className="text-sm text-red-500">
                {errors.role.message}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
            >
              {editingUserId ? "Update User" : "Add User"}
            </button>
            {editingUserId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full bg-gray-600 text-white py-3 rounded-lg shadow hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* User Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Users List
        </h2>
        <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-t border-gray-200`}
              >
                <td className="px-6 py-4 text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-gray-700">{user.role}</td>
                <td className="px-6 py-4 flex space-x-4">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagementPage;
