import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
  user,
  showNavbar = true,
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Fixed Sidebar */}
      <Sidebar user={user} />

      {/* Main application area */}
      <div className="min-h-screen lg:ml-72">

        {/* Navbar */}
        {showNavbar && <Navbar user={user} />}

        {/* Page */}
        <main>
          {children}
        </main>

      </div>

    </div>
  );
}