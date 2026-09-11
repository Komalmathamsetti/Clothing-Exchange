/*import Sidebar from "./Sidebar";
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
}*/
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
  user,
  showNavbar = true,
}) {
  const storedUser = localStorage.getItem("user");

  let savedUser = null;

  try {
    savedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
  }

  // Prefer user passed by the page.
  // If the page doesn't pass one, use localStorage.
  const currentUser = user || savedUser;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Sidebar user={currentUser} />

      <div className="min-h-screen min-w-0 md:ml-72">
        {showNavbar && <Navbar user={currentUser} />}

        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}