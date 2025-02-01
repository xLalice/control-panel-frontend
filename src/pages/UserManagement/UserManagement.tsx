import { useState, useEffect } from "react";
import { fetchUsers, addUser, deleteUser, updateUser } from "../../api/api";
import { useForm } from "react-hook-form";
import { Edit2, Trash2, Plus } from "lucide-react";

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

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchData();
  }, []);

  const onSubmit = async (data: UserFormData) => {
    if (editingUserId) {
      try {
        const response = await updateUser(editingUserId, data);
        setUsers((prevUsers: User[]) =>
          prevUsers.map((user) =>
            user.id === editingUserId ? response.updatedUser : user
          )
        );
        setEditingUserId(null);
        reset();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      try {
        const response = await addUser(data);
        setUsers((prevUsers: User[]) => [...prevUsers, response.newUser]);
        reset();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("password", "");
    setValue("role", user.role);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers((prevUsers: User[]) => 
        prevUsers.filter((user) => user.id !== id)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-black">User Management</h1>
          <div className="h-1 w-20 bg-yellow-500"></div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
              {editingUserId ? (
                <>
                  <Edit2 className="w-6 h-6 text-yellow-500" />
                  Edit User
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 text-yellow-500" />
                  Add New User
                </>
              )}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter name"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter email"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-yellow-500 focus:border-yellow-500"
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
                  <span className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-200"
              >
                {editingUserId ? "Update User" : "Add User"}
              </button>
              {editingUserId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-black">Users List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-gray-800">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-gray-600 hover:text-yellow-500 transition-colors duration-200"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementPage;