import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
export default function DashboardLayout({ children, user, showNavbar = true }) {
  return (
    <div className="bg-slate-100">
      <Sidebar />
      <div className="ml-72">
        {showNavbar && <Navbar user={user}/>}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}