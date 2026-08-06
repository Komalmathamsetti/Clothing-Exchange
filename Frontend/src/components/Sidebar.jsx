import {Link,useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
export default function Sidebar(){
  const navigate = useNavigate();
  const handleLogout = async () => {
  const result = await Swal.fire({
    title: "Logout?",
    text: "Are you sure you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#ef4444",
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }
  };
    return(
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-xl text-white shadow-lg shadow-emerald-200">
            ♻
          </div>
          <div>
            <h1 className="text-lg font-bold">ClothSwap</h1>
            <p className="text-xs text-slate-400">Sustainable fashion</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          <Link to="/dashboard" className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">🏠 Dashboard</Link>
          <Link to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">👤 My Profile</Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">👕 Add Clothing</Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">📦 My Listings</Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">🛍 Browse Clothes</Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            🔄 Swap Requests
            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">4</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">📜 Swap History</Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">💬 Messages</Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">📍 Nearby Swaps</Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">💰 Value Calculator</Link>
          <Link to="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">🔔 Notifications</Link>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600">
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
    );
}