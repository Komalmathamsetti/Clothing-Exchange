import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/AdminLayout";
import { getAdminUsers } from "../../services/adminServices";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getAdminUsers();

      setUsers(response.data.users || []);
    } catch (error) {
      console.log("GET ADMIN USERS ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsers = async()=>{
       await fetchUsers();
    }
    loadUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>

          <p className="text-gray-500 mt-1">
            View and manage registered users on the platform.
          </p>
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Users</p>

            <h2 className="text-2xl font-bold mt-2">{users.length}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Regular Users</p>

            <h2 className="text-2xl font-bold mt-2">
              {users.filter((user) => user.role !== "ADMIN").length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">Administrators</p>

            <h2 className="text-2xl font-bold mt-2">
              {users.filter((user) => user.role === "ADMIN").length}
            </h2>
          </div>
        </div>

        {/* Users Table */}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-800">Registered Users</h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      User
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Location
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Rating
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Swaps
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      {/* User */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.full_name}
                          </p>

                          <p className="text-xs text-gray-400">ID: {user.id}</p>
                        </div>
                      </td>

                      {/* Email */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>

                      {/* Location */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.city || "-"}
                        {user.state ? `, ${user.state}` : ""}
                      </td>

                      {/* Rating */}

                      <td className="px-6 py-4 text-sm">
                        {user.rating ?? "0"}
                      </td>

                      {/* Completed swaps */}

                      <td className="px-6 py-4 text-sm">
                        {user.completed_swaps ?? 0}
                      </td>

                      {/* Role */}

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
