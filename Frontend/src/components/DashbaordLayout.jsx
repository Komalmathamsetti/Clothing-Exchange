import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
  user,
  showNavbar = true,
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">

      <Sidebar user={user} />

      <div className="min-h-screen min-w-0 md:ml-72">

        {showNavbar && <Navbar user={user} />}

        <main className="min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}