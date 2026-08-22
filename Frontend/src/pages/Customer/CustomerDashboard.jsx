import { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { getProfile } from "../../services/userServices";
import DashboardLayout from "../../components/DashbaordLayout";
import { getDashboard } from "../../services/dashboardServices";
export default function Dashboard() {
  const navigate = useNavigate();
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
  stats: {
    totalListings: 0,
    activeSwaps: 0,
    completedSwaps: 0,
    pendingRequests: 0,
  },
  recentActivity: [],
  recentListings: [],
  });
  const fetchProfile = async () => {
  try {
    const [profileResponse, dashboardResponse] =
      await Promise.all([
        getProfile(),
        getDashboard(),
      ]);

    setUser(profileResponse.data.user);

    setDashboard({
      stats: dashboardResponse.data.stats || {
        totalListings: 0,
        activeSwaps: 0,
        completedSwaps: 0,
        pendingRequests: 0,
      },

      recentActivity:
        dashboardResponse.data.recentActivity || [],

      recentListings:
        dashboardResponse.data.recentListings || [],
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    navigate("/login");
  } finally {
    setLoading(false);
  }
};
  useEffect(()=>{
    const loadProfile = async()=>{
        await fetchProfile();
    };
    loadProfile();
  });
  if(loading){
    return(
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">
            Loading...
        </h1>
      </div>
    );
  }
  return (
    <DashboardLayout user = {user}>
        <div className="space-y-8">
          <section className="relative overflow-hidden rounded-3xl bg-emerald-600 p-7 text-white shadow-xl shadow-emerald-100 sm:p-10">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-3 text-sm text-emerald-100">Thursday, August 8, 2024</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome Back, {user?.full_name} 👋</h2>
              <p className="mt-3 text-sm leading-6 text-emerald-50 sm:text-base">
                Manage your clothing swaps and help build a sustainable fashion community.
              </p>
              <Link to="/add-clothing" className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50">
                + Add New Clothing
              </Link>
            </div>
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-500/60" />
            <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full border-45 border-emerald-400/30" />
          </section>

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex justify-between text-2xl">📦 <span className="text-xs font-semibold text-emerald-600">+12.5%</span></div>
              <p className="mt-5 text-sm text-slate-500">Total Listings</p>
              <p className="mt-1 text-3xl font-bold">{dashboard.stats.totalListings}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex justify-between text-2xl">🔄 <span className="text-xs font-semibold text-emerald-600">+8.2%</span></div>
              <p className="mt-5 text-sm text-slate-500">Active Swaps</p>
              <p className="mt-1 text-3xl font-bold">{dashboard.stats.activeSwaps}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex justify-between text-2xl">✅ <span className="text-xs font-semibold text-emerald-600">+24.8%</span></div>
              <p className="mt-5 text-sm text-slate-500">Completed Swaps</p>
              <p className="mt-1 text-3xl font-bold">{dashboard.stats.completedSwaps}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex justify-between text-2xl">⏳ <span className="text-xs font-semibold text-amber-600">Needs review</span></div>
              <p className="mt-5 text-sm text-slate-500">Pending Requests</p>
              <p className="mt-1 text-3xl font-bold">{dashboard.stats.pendingRequests}</p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Recent Activity</h2>
                  <p className="mt-1 text-sm text-slate-400">Your latest swap updates</p>
                </div>
                <a href="#" className="text-sm font-semibold text-emerald-600">View all</a>
              </div>

              {dashboard.recentActivity.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-400">
                  No recent swap activity.
                </div>
              ) : (
                dashboard.recentActivity.map((activity) => {
                  const isReceiver = Number(activity.reciever_id) === Number(user?.id);
                  const status = activity.status?.toUpperCase();
                  let title = "Swap updated";
                  if (status === "COMPLETED") {
                    title = "Swap completed";
                  } else if (status === "PENDING" && isReceiver) {
                    title = "New swap request received";
                  } else if (status === "ACCEPTED") {
                    title = "Swap request accepted";
                  } else if (status === "REJECTED") {
                    title = "Swap request rejected";
                  }
                  const otherUser = isReceiver ? activity.sender_name : activity.reciever_name;
                  const itemName = isReceiver ? activity.reciever_item_title : activity.sender_item_title;
                  return (
                  <div key={activity.id} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                      🔄
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {title}
                        {otherUser ? ` with ${otherUser}` : ""}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {itemName || "Clothing item"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {status || "UNKNOWN"}
                    </span>
                  </div>
                  );
                })
                )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
              <h2 className="text-lg font-bold">Quick Actions</h2>
              <p className="mt-1 text-sm text-slate-400">Jump back into your wardrobe</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link to="/add-clothing" className="rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50">
                  <span className="text-xl">👕</span>
                  <p className="mt-3 text-sm font-semibold">Add Clothing</p>
                </Link>
                <Link to="/browse-clothes" className="rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50">
                  <span className="text-xl">🛍</span>
                  <p className="mt-3 text-sm font-semibold">Browse Clothes</p>
                </Link>
                <Link to="/swap-requests" className="rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50">
                  <span className="text-xl">🔄</span>
                  <p className="mt-3 text-sm font-semibold">Swap Requests</p>
                </Link>
                <Link to="/messages" className="rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50">
                  <span className="text-xl">💬</span>
                  <p className="mt-3 text-sm font-semibold">Messages</p>
                </Link>
                <Link to="/nearby-swaps" className="col-span-2 rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50">
                  <span className="text-xl">📍</span>
                  <p className="mt-3 text-sm font-semibold">Nearby Swaps</p>
                </Link>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-lg font-bold">Recent Listings</h2>
                <p className="mt-1 text-sm text-slate-400">Manage your recently added pieces</p>
              </div>
              <Link to="/my-listings" className="text-sm font-semibold text-emerald-600">View all</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {dashboard.recentListings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                        No clothing listings found.
                      </td>
                    </tr>
                    ) : (
                      dashboard.recentListings.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                            👕
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {item.category_name || "Not specified"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                              {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {item.city}, {item.state}
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/clothing/${item.id}`} className="font-semibold text-emerald-600 hover:text-emerald-700">
                            View
                          </Link>
                        </td>
                      </tr>
                      ))
                      )}
                    </tbody>
              </table>
            </div>
          </section>

          <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row">
            <p>© 2024 ClothSwap. Make fashion circular.</p>
            <div className="flex gap-5">
              <Link to="#" className="hover:text-emerald-600">Help Center</Link>
              <Link to="#" className="hover:text-emerald-600">Privacy</Link>
              <Link to="#" className="hover:text-emerald-600">Terms</Link>
            </div>
          </footer>
        </div>
  </DashboardLayout>
  );
}