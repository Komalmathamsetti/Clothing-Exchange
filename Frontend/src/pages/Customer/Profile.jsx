import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashbaordLayout";
import {
  getProfile,
  deleteAccount,
  getDashboardStats,
} from "../../services/userServices";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    listings: 0,
    successfulSwaps: 0,
    swapRequests: 0,
    pendingSwaps: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const profileResponse = await getProfile();

        setUser(profileResponse.data.user);

        const dashboardResponse = await getDashboardStats();

        setDashboard(dashboardResponse.data.stats);

        setRecentActivity(dashboardResponse.data.recentActivity || []);

        setProfileCompletion(dashboardResponse.data.profileCompletion || 0);
      } catch (error) {
        console.error("FETCH DASHBOARD ERROR:", error);

        toast.error(
          error.response?.data?.message || "Unable to fetch dashboard",
        );

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      const response = await deleteAccount();
      toast.success(response.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <DashboardLayout user={user} showNavbar={false}>
      <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Account settings
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">My Profile</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and ClothSwap preferences.
          </p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-36 bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-400" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-linear-to-br from-emerald-100 via-teal-100 to-slate-200 text-4xl font-bold text-emerald-700 shadow-lg">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={`${user?.full_name || "User"} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.full_name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold">{user?.full_name}</h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Verified member
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Sustainable fashion enthusiast · {user?.city}, {user?.state}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/update-profile"
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/update-profile"
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Change Password
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-6 border-t border-slate-100 pt-7 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email
                </p>
                <p className="mt-2 text-sm font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Phone
                </p>
                <p className="mt-2 text-sm font-medium">{user?.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  City
                </p>
                <p className="mt-2 text-sm font-medium">{user?.city}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  State
                </p>
                <p className="mt-2 text-sm font-medium">{user?.state}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Role
                </p>
                <p className="mt-2 text-sm font-medium">{user?.role}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📦</span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                Active
              </span>
            </div>
            <p className="mt-5 text-sm text-slate-500">Listings</p>
            <p className="mt-1 text-3xl font-bold">{dashboard.listings}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">✅</span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                Great work
              </span>
            </div>
            <p className="mt-5 text-sm text-slate-500">Successful Swaps</p>
            <p className="mt-1 text-3xl font-bold">
              {dashboard.successfulSwaps}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔄</span>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">
                {dashboard.pendingSwaps} pending
              </span>
            </div>
            <p className="mt-5 text-sm text-slate-500">Swap Requests</p>
            <p className="mt-1 text-3xl font-bold">{dashboard.pendingSwaps}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 xl:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Recent Swap Activity</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Your latest community interactions
                </p>
              </div>
              <Link to="/history" className="text-sm font-semibold text-emerald-600">
                View all
              </Link>
            </div>

            <div className="relative mt-8 space-y-8 before:absolute before:bottom-2 before:left-3.75 before:top-2 before:w-px before:bg-slate-200">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No recent swap activity.
                </p>
              ) : (
                recentActivity.map((activity) => {
                  const isSender =
                    Number(activity.sender_id) === Number(user?.id);

                  const otherUser = isSender
                    ? activity.reciever_name
                    : activity.sender_name;

                  return (
                    <div key={activity.id} className="relative flex gap-4">
                      {/* Activity icon */}
                      <div
                        className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                          activity.status === "ACCEPTED"
                            ? "bg-emerald-100"
                            : "bg-amber-100"
                        }`}
                      >
                        {activity.status === "ACCEPTED" ? "✓" : "↗"}
                      </div>

                      {/* Activity content */}
                      <div>
                        <p className="text-sm font-semibold">
                          {activity.status === "ACCEPTED"
                            ? `Swap completed with ${otherUser}`
                            : `Swap request with ${otherUser}`}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {isSender
                            ? `You offered ${
                                activity.sender_item_title || "an item"
                              }.`
                            : `${otherUser || "The user"} offered ${
                                activity.sender_item_title || "an item"
                              }.`}
                        </p>

                        <p className="mt-2 text-xs font-medium text-emerald-600">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 xl:col-span-2">
            <h3 className="text-lg font-bold">Profile Completion</h3>
            <p className="mt-1 text-sm text-slate-400">
              Complete your profile to build trust.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <div
                className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#10b981 ${profileCompletion * 3.6}deg,#e2e8f0 ${profileCompletion * 3.6}deg 360deg)`,
                }}
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-900">
                      {profileCompletion}%
                    </p>
                    <p className="text-xs text-slate-400">Complete</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-emerald-600">
                  <span>✓</span>
                  <span>Basic information</span>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    user?.profile_image ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  <span>{user?.profile_image ? "✓" : "○"}</span>

                  <span>Profile photo</span>
                </div>
              </div>
            </div>

            <Link
              to="/update-profile"
              className="mt-8 block rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
            >
              Complete Profile
            </Link>
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-red-100 bg-red-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="font-bold text-red-900">Danger Zone</h3>
            <p className="mt-1 text-sm text-red-700">
              Deleting your account permanently removes your profile and
              activity.
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 cursor-pointer"
          >
            Delete Account
          </button>
        </section>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© 2024 ClothSwap. Make fashion circular.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-emerald-600">
              Help Center
            </a>
            <a href="#" className="hover:text-emerald-600">
              Privacy
            </a>
            <a href="#" className="hover:text-emerald-600">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
