import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import AdminLayout from "../../components/AdminLayout";
import { getAdminDashboard } from "../../services/adminServices";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await getAdminDashboard();

      setDashboard(response.data);
    } catch (error) {
      console.log("ADMIN DASHBOARD ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchDashboard();
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!dashboard) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            Unable to load dashboard
          </h2>

          <button
            onClick={fetchDashboard}
            className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  const { statistics, swapActivity, recentUsers, recentSwaps } = dashboard;

  const maxSwapCount = Math.max(
    ...swapActivity.map((item) => Number(item.count)),
    1,
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        {/* ========================================== */}
        {/* Welcome */}
        {/* ========================================== */}

        <div className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-r from-emerald-700 via-emerald-600 to-teal-600 p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-100">
              Administration Center
            </p>

            <h1 className="text-3xl font-black sm:text-4xl">
              Welcome back, Admin 👋
            </h1>

            <p className="mt-3 max-w-xl text-emerald-50/90">
              Here's what's happening across ClothSwap today. Monitor your
              community, listings and exchanges from one place.
            </p>
          </div>

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-28 right-24 h-72 w-72 rounded-full bg-white/5" />

          <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/20 bg-white/10 text-6xl shadow-2xl backdrop-blur-md">
              ♻️
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* Statistics */}
        {/* ========================================== */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* Users */}

          <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.totalUsers.toLocaleString()}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                👥
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                ↑ {statistics.userGrowth}%
              </span>

              <span className="text-xs text-slate-400">vs previous month</span>
            </div>
          </div>

          {/* Listings */}

          <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Listings
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.activeListings.toLocaleString()}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                👕
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                +{statistics.listingGrowth}%
              </span>

              <span className="text-xs text-slate-400">this month</span>
            </div>
          </div>

          {/* Swaps */}

          <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed Swaps
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.completedSwaps.toLocaleString()}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                🔄
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                {statistics.currentMonthSwaps}
              </span>

              <span className="text-xs text-slate-400">
                completed this month
              </span>
            </div>
          </div>

          {/* Pending issues */}

          <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Issues
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.pendingDisputes}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
                ⚠️
              </div>
            </div>

            <div className="mt-4">
              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">
                Dispute system
              </span>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* Middle */}
        {/* ========================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Swap chart */}

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Swap Activity
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Swap requests during the last 7 days
                </p>
              </div>

              <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600">
                Last 7 days
              </span>
            </div>

            <div className="mt-8 flex h-56 items-end justify-between gap-3">
              {swapActivity.map((item) => {
                const height = (Number(item.count) / maxSwapCount) * 100;

                const date = new Date(item.date);

                return (
                  <div
                    key={item.date}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div
                      title={`${item.count} swaps`}
                      className="rounded-t-xl bg-linear-to-t from-emerald-600 to-emerald-400 transition hover:from-emerald-700 hover:to-emerald-500"
                      style={{
                        height: `${Math.max(height, 5)}%`,
                      }}
                    />

                    <p className="mt-3 text-center text-xs text-slate-400">
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick overview */}

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Platform Overview
            </h2>

            <p className="mt-1 text-sm text-slate-400">Current activity</p>

            <div className="mt-7 space-y-5">
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📩</span>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Pending Requests
                      </p>

                      <p className="text-xs text-slate-500">
                        Waiting for responses
                      </p>
                    </div>
                  </div>

                  <span className="text-xl font-black text-blue-600">
                    {statistics.pendingSwaps}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Completed Swaps
                      </p>

                      <p className="text-xs text-slate-500">
                        Successful exchanges
                      </p>
                    </div>
                  </div>

                  <span className="text-xl font-black text-emerald-600">
                    {statistics.completedSwaps}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👕</span>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Available Clothes
                      </p>

                      <p className="text-xs text-slate-500">
                        Currently available
                      </p>
                    </div>
                  </div>

                  <span className="text-xl font-black text-purple-600">
                    {statistics.activeListings}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-bold text-emerald-700">
                      System operational
                    </p>

                    <p className="text-xs text-emerald-600">
                      Database connected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* Recent Activity */}
        {/* ========================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent users */}

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-bold text-slate-900">Recent Users</h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest registrations
                </p>
              </div>

              <Link
                to="/admin/users"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {user.full_name}
                      </p>

                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent swaps */}

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Swap Activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest platform activity
                </p>
              </div>

              <Link
                to="/admin/swaps"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentSwaps.map((swap) => (
                <div
                  key={swap.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                      🔄
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {swap.sender_name}
                        {" → "}
                        {swap.receiver_name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {swap.sender_item_title || "Item"}
                        {" ↔ "}
                        {swap.receiver_item_title || "Item"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      swap.status === "ACCEPTED"
                        ? "bg-emerald-50 text-emerald-600"
                        : swap.status === "PENDING"
                          ? "bg-blue-50 text-blue-600"
                          : swap.status === "REJECTED"
                            ? "bg-red-50 text-red-600"
                            : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {swap.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* Quick Actions */}
        {/* ========================================== */}

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-400">
            Frequently used administration tools
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Link
              to="/admin/users"
              className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-2xl">👥</span>

              <p className="mt-3 text-sm font-bold text-slate-800">
                Manage Users
              </p>

              <p className="mt-1 text-xs text-slate-400">View users</p>
            </Link>

            <Link
              to="/admin/listings"
              className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-2xl">👕</span>

              <p className="mt-3 text-sm font-bold text-slate-800">
                Review Listings
              </p>

              <p className="mt-1 text-xs text-slate-400">Moderate clothes</p>
            </Link>

            <Link
              to="/admin/swaps"
              className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-2xl">🔄</span>

              <p className="mt-3 text-sm font-bold text-slate-800">
                Monitor Swaps
              </p>

              <p className="mt-1 text-xs text-slate-400">Track activity</p>
            </Link>

            <Link
              to="/admin/disputes"
              className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-2xl">⚠️</span>

              <p className="mt-3 text-sm font-bold text-slate-800">
                Resolve Issues
              </p>

              <p className="mt-1 text-xs text-slate-400">Review disputes</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
