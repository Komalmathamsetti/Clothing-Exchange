import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  return (
    <header className="sticky top-0 z-20 flex h-21.5 w-full items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8">

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          ⌕
        </span>

        <input
          type="search"
          placeholder="Search clothes, swaps..."
          className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white sm:w-72"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <Link
          to="#"
          className="relative flex h-10 w-10 items-center justify-center text-xl"
        >
          🔔

          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </Link>

        {/* Divider */}
        <div className="h-10 w-px bg-slate-200" />

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="hidden sm:block">
            <p className="max-w-35 truncate text-sm font-semibold text-slate-800">
              {user?.full_name || "User"}
            </p>

            <p className="text-xs text-slate-400">
              {user?.role || "USER"}
            </p>
          </div>

        </div>

      </div>
    </header>
  );
}