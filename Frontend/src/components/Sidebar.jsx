import {NavLink,useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
export default function Sidebar(){
  const navigate = useNavigate();
  const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-100 text-emerald-700"
      : "text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
  }`;
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
      navigate("/");
    }, 1500);
  }
  };
    return(
    <>
      <aside className="fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 flex flex-col">
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
          <NavLink to="/dashboard" className={navClass}>🏠 Dashboard</NavLink>
          <NavLink to="/profile" className={navClass}>👤 My Profile</NavLink>
          <NavLink to="/add-clothing" className={navClass}>👕 Add Clothing</NavLink>
          <NavLink to="/my-listings" className={navClass}>📦 My Listings</NavLink>
          <NavLink to="browse-clothes" className={navClass}>🛍 Browse Clothes</NavLink>
          <NavLink to="/swap-requests" className={navClass}>
            🔄 Swap Requests
            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">4</span>
          </NavLink>
          <NavLink to="/history" className={navClass}>📜 Swap History</NavLink>
          <NavLink to="/messages" className={navClass}>💬 Messages</NavLink>
          <NavLink to="/nearby-swaps" className={navClass}>📍 Nearby Swaps</NavLink>
          <NavLink to="/caluculator" className={navClass}>💰 Value Calculator</NavLink>
          <NavLink to="/notifications" className={navClass}>🔔 Notifications</NavLink>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer">
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
    );
}