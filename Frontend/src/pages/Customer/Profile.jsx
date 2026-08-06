export default function Profile() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            🏠 Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            👤 My Profile
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            👕 Add Clothing
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            📦 My Listings
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            🛍 Browse Clothes
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            🔄 Swap Requests
            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
              4
            </span>
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            📜 Swap History
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            💬 Messages
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            📍 Nearby Swaps
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            💰 Value Calculator
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            🔔 Notifications
          </a>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600">
            🚪 Logout
          </a>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
            >
              ☰
            </a>

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
            <a href="#" className="relative text-xl text-slate-500">
              🔔
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </a>

            <a href="#" className="flex items-center gap-3 border-l border-slate-200 pl-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                AM
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Alex Morgan</p>
                <p className="text-xs text-slate-400">Fashion enthusiast</p>
              </div>
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
          <div>
            <p className="text-sm font-medium text-emerald-600">Account settings</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">My Profile</h2>
            <p className="mt-2 text-sm text-slate-500">
              Manage your personal information and ClothSwap preferences.
            </p>
          </div>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-36 bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-400" />

            <div className="px-6 pb-7 sm:px-8">
              <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-white bg-linear-to-br from-emerald-100 via-teal-100 to-slate-200 text-4xl font-bold text-emerald-700 shadow-lg">
                    AM
                  </div>

                  <div className="pb-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold">Alex Morgan</h3>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        Verified member
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Sustainable fashion enthusiast · Brooklyn, NY
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="#"
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                  >
                    Edit Profile
                  </a>
                  <a
                    href="#"
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Change Password
                  </a>
                </div>
              </div>

              <div className="mt-8 grid gap-6 border-t border-slate-100 pt-7 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</p>
                  <p className="mt-2 text-sm font-medium">alex.morgan@example.com</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</p>
                  <p className="mt-2 text-sm font-medium">+1 (555) 284-0198</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">City</p>
                  <p className="mt-2 text-sm font-medium">Brooklyn</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">State</p>
                  <p className="mt-2 text-sm font-medium">New York</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Role</p>
                  <p className="mt-2 text-sm font-medium">Community Member</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Member Since</p>
                  <p className="mt-2 text-sm font-medium">March 2023</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📦</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">Active</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Listings</p>
              <p className="mt-1 text-3xl font-bold">24</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl">✅</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">Great work</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Successful Swaps</p>
              <p className="mt-1 text-3xl font-bold">36</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔄</span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">4 pending</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Swap Requests</p>
              <p className="mt-1 text-3xl font-bold">18</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl">♡</span>
                <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600">Saved</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Wishlist</p>
              <p className="mt-1 text-3xl font-bold">12</p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 xl:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Recent Swap Activity</h3>
                  <p className="mt-1 text-sm text-slate-400">Your latest community interactions</p>
                </div>
                <a href="#" className="text-sm font-semibold text-emerald-600">View all</a>
              </div>

              <div className="relative mt-8 space-y-8 before:absolute before:bottom-2 before:left-3.75 before:top-2 before:w-px before:bg-slate-200">
                <div className="relative flex gap-4">
                  <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm">✓</div>
                  <div>
                    <p className="text-sm font-semibold">Swap completed with Jamie Wilson</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">You exchanged your vintage denim jacket for a wool coat.</p>
                    <p className="mt-2 text-xs font-medium text-emerald-600">Today · 2 hours ago</p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm">↗</div>
                  <div>
                    <p className="text-sm font-semibold">New swap request received</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">Taylor wants to swap for your linen summer shirt.</p>
                    <p className="mt-2 text-xs font-medium text-amber-600">Today · 5 hours ago</p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm">♡</div>
                  <div>
                    <p className="text-sm font-semibold">Your floral midi dress was liked</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">Someone nearby saved your listing to their wishlist.</p>
                    <p className="mt-2 text-xs font-medium text-slate-500">Yesterday · 4:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 xl:col-span-2">
              <h3 className="text-lg font-bold">Profile Completion</h3>
              <p className="mt-1 text-sm text-slate-400">Complete your profile to build trust.</p>

              <div className="mt-8 flex items-center gap-6">
                <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#10b981_0deg_288deg,#e2e8f0_288deg_360deg)]">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-900">80%</p>
                      <p className="text-xs text-slate-400">Complete</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span>✓</span>
                    <span>Basic information</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span>✓</span>
                    <span>Profile photo</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>○</span>
                    <span>Add a short bio</span>
                  </div>
                </div>
              </div>

              <a
                href="#"
                className="mt-8 block rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
              >
                Complete Profile
              </a>
            </div>
          </section>

          <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-red-100 bg-red-50 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h3 className="font-bold text-red-900">Danger Zone</h3>
              <p className="mt-1 text-sm text-red-700">
                Deleting your account permanently removes your profile and activity.
              </p>
            </div>
            <a
              href="#"
              className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Delete Account
            </a>
          </section>

          <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row">
            <p>© 2024 ClothSwap. Make fashion circular.</p>
                        <div className="flex gap-5">
              <a href="#" className="hover:text-emerald-600">
                Help Center
              </a>
              <a href="#" className="hover:text-emerald-600">
                Privacy
              </a>
              <a href="#" className="hover:text-emerald-600">
                Terms
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}