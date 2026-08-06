export default function EditProfile() {
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

        <div className="mx-auto max-w-5xl space-y-8 p-5 sm:p-8">
          <div>
            <p className="text-sm font-medium text-emerald-600">Account settings</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">Edit Profile</h2>
            <p className="mt-2 text-sm text-slate-500">
              Keep your profile information up to date.
            </p>
          </div>

          <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h3 className="text-lg font-bold">Personal Information</h3>
              <p className="mt-1 text-sm text-slate-400">
                Update your public profile details.
              </p>
            </div>

            <div className="mb-8 flex flex-col items-center gap-5 rounded-2xl bg-slate-50/80 p-6 sm:flex-row">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-white bg-linear-to-br from-emerald-100 via-teal-100 to-slate-200 text-3xl font-bold text-emerald-700 shadow-lg">
                AM
              </div>

              <div className="text-center sm:text-left">
                <h4 className="font-semibold">Profile Photo</h4>
                <p className="mt-1 text-sm text-slate-400">
                  JPG, PNG or WEBP. Maximum file size 5MB.
                </p>
                <a
                  href="#"
                  className="mt-4 inline-flex rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50"
                >
                  Upload New Photo
                </a>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value="Alex Morgan"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value="alex.morgan@example.com"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-400 outline-none"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Your email address cannot be changed here.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value="+1 (555) 284-0198"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  value="Brooklyn"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  State
                </label>
                <input
                  type="text"
                  value="New York"
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </label>
                <input
                  type="text"
                  value="Community Member"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-400 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <a
                href="#"
                className="rounded-xl border border-slate-200 px-6 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </a>
              <a
                href="#"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
              >
                Save Changes
              </a>
            </div>
          </section>

          <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h3 className="text-lg font-bold">Change Password</h3>
              <p className="mt-1 text-sm text-slate-400">
                Use a strong password to keep your account secure.
              </p>
            </div>

            <div className="max-w-2xl space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <a
                href="#"
                className="inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 hover:bg-slate-800"
              >
                Update Password
              </a>
            </div>
          </section>

          <section className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-red-200 bg-red-50/80 p-6 shadow-lg shadow-red-100/50 sm:flex-row sm:items-center sm:p-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-lg text-red-600">
                  ⚠
                </div>
                <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-6 text-red-700">
                Deleting your account permanently removes your profile, listings,
                swap history and messages. This action cannot be undone.
              </p>
            </div>

            <a
              href="#"
              className="shrink-0 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100"
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