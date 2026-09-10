import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import {
  Search,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Lock,
  Unlock,
  MapPin,
  Mail,
  Phone,
  Calendar,
  X,
  Star,
  ArrowUpRight,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout";

import {
  getAdminUsers,
  updateAdminUserStatus,
} from "../../services/adminServices";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedUser, setSelectedUser] = useState(null);

  /*
    --------------------------------------------------
    CURRENT ADMIN
    --------------------------------------------------
    */

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  /*
    --------------------------------------------------
    LOAD USERS
    --------------------------------------------------
    */

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAdminUsers();

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("LOAD ADMIN USERS ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Users",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading users.",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
    --------------------------------------------------
    REFRESH
    --------------------------------------------------
    */

  const refreshUsers = async () => {
    try {
      setRefreshing(true);

      const response = await getAdminUsers();

      setUsers(response.data.users || []);

      Swal.fire({
        icon: "success",
        title: "Refreshed",
        text: "User list has been updated.",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Refresh Failed",
        text: error.response?.data?.message || "Unable to refresh users.",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async()=>{
      await loadUsers();
    }
    fetchUsers();
  }, []);

  /*
    --------------------------------------------------
    FILTER USERS
    --------------------------------------------------
    */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText =
        `${user.full_name || ""} ${user.email || ""} ${user.city || ""} ${user.state || ""}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.is_active) ||
        (statusFilter === "SUSPENDED" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  /*
    --------------------------------------------------
    STATISTICS
    --------------------------------------------------
    */

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.is_active).length;

  const suspendedUsers = users.filter((user) => !user.is_active).length;

  const administrators = users.filter((user) => user.role === "ADMIN").length;

  /*
    --------------------------------------------------
    SUSPEND / ACTIVATE USER
    --------------------------------------------------
    */

  const handleStatusChange = async (user) => {
    const activating = !user.is_active;

    const result = await Swal.fire({
      title: activating ? "Activate User?" : "Suspend User?",

      html: activating
        ? `
                    <p style="font-size:15px">
                        <strong>${user.full_name}</strong>
                        will be able to access the platform again.
                    </p>
                  `
        : `
                    <p style="font-size:15px">
                        <strong>${user.full_name}</strong>
                        will no longer be able to access their account.
                    </p>
                  `,

      icon: activating ? "question" : "warning",

      showCancelButton: true,

      confirmButtonText: activating ? "Yes, Activate" : "Yes, Suspend",

      cancelButtonText: "Cancel",

      confirmButtonColor: activating ? "#059669" : "#dc2626",

      cancelButtonColor: "#64748b",

      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await updateAdminUserStatus(user.id, activating);

      /*
            Update table immediately
            */

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                is_active: activating,
              }
            : item,
        ),
      );

      /*
            Update modal if open
            */

      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser((previous) => ({
          ...previous,
          is_active: activating,
        }));
      }

      Swal.fire({
        icon: "success",

        title: activating ? "User Activated" : "User Suspended",

        text: activating
          ? "The user can access the platform again."
          : "The user has been suspended successfully.",

        timer: 1500,

        showConfirmButton: false,
      });
    } catch (error) {
      console.error("UPDATE USER STATUS ERROR:", error);

      Swal.fire({
        icon: "error",

        title: "Action Failed",

        text: error.response?.data?.message || "Unable to update user status.",
      });
    }
  };

  /*
    --------------------------------------------------
    VIEW USER
    --------------------------------------------------
    */

  const viewUser = (user) => {
    setSelectedUser(user);
  };

  /*
    --------------------------------------------------
    RENDER
    --------------------------------------------------
    */

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-1">
        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                  <Users size={27} className="text-emerald-600" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                      Manage Users
                    </h1>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      ADMIN
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Monitor, manage and moderate registered users.
                  </p>
                </div>
              </div>
            </div>

            {/* Refresh */}

            <button
              onClick={refreshUsers}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh Users"}
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            description="Registered accounts"
            icon={<Users size={23} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Active Users"
            value={activeUsers}
            description="Accounts with access"
            icon={<UserCheck size={23} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Suspended"
            value={suspendedUsers}
            description="Restricted accounts"
            icon={<UserX size={23} />}
            iconClass="bg-red-50 text-red-600"
          />

          <StatCard
            title="Administrators"
            value={administrators}
            description="Protected admin accounts"
            icon={<Shield size={23} />}
            iconClass="bg-purple-50 text-purple-600"
          />
        </div>

        {/* ================================================= */}
        {/* SEARCH + FILTER */}
        {/* ================================================= */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Find Users</h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and filter platform accounts.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by name, email or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            {/* Role */}

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            >
              <option value="ALL">All Roles</option>

              <option value="USER">Regular Users</option>

              <option value="ADMIN">Administrators</option>
            </select>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            >
              <option value="ALL">All Status</option>

              <option value="ACTIVE">Active</option>

              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* ================================================= */}
        {/* USER TABLE */}
        {/* ================================================= */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}

          <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {users.length}
                </span>{" "}
                users
              </p>
            </div>

            {/* Filter indicator */}

            {(search || roleFilter !== "ALL" || statusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("ALL");
                  setStatusFilter("ALL");
                }}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Loading */}

          {loading ? (
            <div className="flex min-h-87.5 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading users...
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty */

            <div className="flex min-h-87.5 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Users size={28} className="text-slate-400" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No users found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                No users match your current search or filters.
              </p>
            </div>
          ) : (
            /* Table */

            <div className="overflow-x-auto">
              <table className="min-w-287.5 w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <TableHeading>User</TableHeading>

                    <TableHeading>Contact</TableHeading>

                    <TableHeading>Location</TableHeading>

                    <TableHeading center>Rating</TableHeading>

                    <TableHeading center>Swaps</TableHeading>

                    <TableHeading center>Status</TableHeading>

                    <TableHeading center>Role</TableHeading>

                    <TableHeading right>Actions</TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const isAdmin = user.role === "ADMIN";

                    const isCurrentAdmin =
                      Number(user.id) === Number(currentUser.id);

                    return (
                      <tr
                        key={user.id}
                        className="group border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        {/* USER */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
                                {user.profile_image ? (
                                  <img
                                    src={user.profile_image}
                                    alt={user.full_name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  user.full_name?.charAt(0)?.toUpperCase()
                                )}
                              </div>

                              {user.is_active && (
                                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {user.full_name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                User ID #{user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail
                              size={15}
                              className="shrink-0 text-slate-400"
                            />

                            <span>{user.email}</span>
                          </div>

                          {user.phone && (
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                              <Phone size={13} />

                              {user.phone}
                            </div>
                          )}
                        </td>

                        {/* LOCATION */}

                        <td className="px-6 py-5">
                          {user.city || user.state ? (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin
                                size={16}
                                className="shrink-0 text-slate-400"
                              />

                              <span>
                                {[user.city, user.state]
                                  .filter(Boolean)
                                  .join(", ")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Not provided
                            </span>
                          )}
                        </td>

                        {/* RATING */}

                        <td className="px-6 py-5 text-center">
                          <div className="inline-flex items-center gap-1">
                            <Star
                              size={15}
                              className="fill-amber-400 text-amber-400"
                            />

                            <span className="font-semibold text-slate-800">
                              {Number(user.rating || 0).toFixed(1)}
                            </span>
                          </div>
                        </td>

                        {/* SWAPS */}

                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 py-1 text-sm font-bold text-slate-700">
                            {user.completed_swaps || 0}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5 text-center">
                          {user.is_active ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              Suspended
                            </span>
                          )}
                        </td>

                        {/* ROLE */}

                        <td className="px-6 py-5 text-center">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
                              <Shield size={13} />
                              ADMIN
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                              USER
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {/* VIEW */}

                            <button
                              onClick={() => viewUser(user)}
                              title="View user details"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <Eye size={17} />
                            </button>

                            {/* USER STATUS */}

                            {!isAdmin && !isCurrentAdmin ? (
                              <button
                                onClick={() => handleStatusChange(user)}
                                title={
                                  user.is_active
                                    ? "Suspend user"
                                    : "Activate user"
                                }
                                className={
                                  user.is_active
                                    ? "flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
                                    : "flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-600 transition hover:bg-emerald-50"
                                }
                              >
                                {user.is_active ? (
                                  <Lock size={16} />
                                ) : (
                                  <Unlock size={16} />
                                )}
                              </button>
                            ) : (
                              <span
                                title="Administrator account protected"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-500"
                              >
                                <Shield size={16} />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================== */}
      {/* USER DETAILS MODAL */}
      {/* ===================================================== */}

      {selectedUser && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  User Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Account information and activity
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="p-6">
              {/* Profile */}

              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-emerald-100 text-3xl font-bold text-emerald-700">
                  {selectedUser.profile_image ? (
                    <img
                      src={selectedUser.profile_image}
                      alt={selectedUser.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    selectedUser.full_name?.charAt(0)?.toUpperCase()
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                  {selectedUser.full_name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedUser.email}
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {selectedUser.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
                      <Shield size={13} />
                      ADMIN
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                      USER
                    </span>
                  )}

                  <span
                    className={
                      selectedUser.is_active
                        ? "rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                        : "rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700"
                    }
                  >
                    {selectedUser.is_active ? "Active" : "Suspended"}
                  </span>
                </div>
              </div>

              {/* Info */}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoBox
                  icon={<Mail size={17} />}
                  label="Email"
                  value={selectedUser.email}
                />

                <InfoBox
                  icon={<Phone size={17} />}
                  label="Phone"
                  value={selectedUser.phone || "Not provided"}
                />

                <InfoBox
                  icon={<MapPin size={17} />}
                  label="Location"
                  value={
                    [selectedUser.city, selectedUser.state]
                      .filter(Boolean)
                      .join(", ") || "Not provided"
                  }
                />

                <InfoBox
                  icon={<Calendar size={17} />}
                  label="Joined"
                  value={
                    selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "Unknown"
                  }
                />
              </div>

              {/* Stats */}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                    <Star size={19} className="fill-amber-400 text-amber-400" />
                  </div>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Rating
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {Number(selectedUser.rating || 0).toFixed(1)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <ArrowUpRight size={19} className="text-emerald-600" />
                  </div>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Completed Swaps
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {selectedUser.completed_swaps || 0}
                  </p>
                </div>
              </div>

              {/* Admin Action */}

              {selectedUser.role !== "ADMIN" && (
                <button
                  onClick={() => handleStatusChange(selectedUser)}
                  className={
                    selectedUser.is_active
                      ? "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
                      : "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  }
                >
                  {selectedUser.is_active ? (
                    <>
                      <Lock size={18} />
                      Suspend User
                    </>
                  ) : (
                    <>
                      <Unlock size={18} />
                      Activate User
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

/*
=====================================================
STAT CARD
=====================================================
*/

const StatCard = ({ title, value, description, icon, iconClass }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-slate-100 opacity-40 transition group-hover:scale-150" />
    </div>
  );
};

/*
=====================================================
TABLE HEADING
=====================================================
*/

const TableHeading = ({ children, center, right }) => {
  return (
    <th
      className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${
        center ? "text-center" : right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
};

/*
=====================================================
INFO BOX
=====================================================
*/

const InfoBox = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
};

export default AdminUsers;
