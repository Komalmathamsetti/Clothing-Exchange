import { Link } from "react-router-dom";
export default function Navbar({user}){
    return(
      <>
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-3">
            <button href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden">
              ☰
            </button>
            <div className="relative hidden sm:block">
              <span className="absolute left-4 top-2.5 text-slate-400">⌕</span>
              <input
                type="search"
                placeholder="Search clothes, swaps..."
                className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link to="#" className="relative text-xl text-slate-500">
              🔔
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </Link>

            <Link to="/profile" className="flex items-center gap-3 border-l border-slate-200 pl-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{user?.full_name}</p>
                <p className="text-xs text-slate-400">{user?.role}</p>
              </div>
            </Link>
          </div>
        </header>
      </>
    );
}