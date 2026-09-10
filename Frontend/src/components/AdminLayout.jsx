import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout from the admin panel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#ffffff",
      color: "#0f172a",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        Swal.fire({
          title: "Logged Out",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });
      }
    });
  };

  const menuItems = [
    {
      name: "Home",
      icon: "🏠",
      path: "/",
    },
    {
      name: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard",
    },
    {
      name: "Manage Users",
      icon: "👥",
      path: "/admin/users",
    },
    {
      name: "Manage Listings",
      icon: "👕",
      path: "/admin/listings",
    },
    {
      name: "Manage Swaps",
      icon: "🔄",
      path: "/admin/swaps",
    },
    {
      name: "Disputes",
      icon: "⚠️",
      path: "/admin/disputes",
    },
    {
      name: "Analytics",
      icon: "📈",
      path: "/admin/analytics",
    },
    {
      name: "Notifications",
      icon: "🔔",
      path: "/admin/notifications",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}

      <aside className="fixed left-0 top-0 z-40 flex h-screen w-80 flex-col border-r border-slate-200 bg-white">
        {/* Logo */}

        <div className="border-b border-slate-100 px-7 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-black text-white shadow-lg shadow-emerald-200">
              C
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900">
                Cloth<span className="text-emerald-600">Swap</span>
              </h1>

              <p className="text-xs font-medium text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin profile */}

        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">
                {user.full_name || "Administrator"}
              </p>

              <p className="text-xs font-semibold text-emerald-600">ADMIN</p>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Administration
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}

      <div className="ml-80 min-h-screen">
        {/* Topbar */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">
          <div>
            <p className="text-sm font-medium text-slate-400">Administration</p>

            <h2 className="text-lg font-bold text-slate-800">
              ClothSwap Admin Panel
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative rounded-full p-2 text-xl transition hover:bg-slate-100">
              🔔
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </button>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : "A"}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {user.full_name || "Administrator"}
                </p>

                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}

        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
