import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const features = [
  {
    icon: "♻️",
    title: "Sustainable Fashion",
    text: "Extend the life of clothes and help reduce textile waste.",
  },
  {
    icon: "🔁",
    title: "Direct Clothing Exchange",
    text: "Swap directly with people who share your style and values.",
  },
  {
    icon: "📍",
    title: "Nearby Swaps",
    text: "Discover trusted fashion exchanges in your local community.",
  },
  {
    icon: "🛡️",
    title: "Trusted Community",
    text: "Connect with verified members and swap with confidence.",
  },
];

const steps = [
  ["01", "Create Account", "Join our sustainable fashion community."],
  ["02", "Upload Clothes", "Share items you no longer wear."],
  ["03", "Send Swap Request", "Find something you love and request a swap."],
  ["04", "Exchange Successfully", "Meet, ship, and enjoy your new wardrobe."],
];

const categories = [
  ["Shirts", "👔"],
  ["T-Shirts", "👕"],
  ["Jeans", "👖"],
  ["Dresses", "👗"],
  ["Jackets", "🧥"],
  ["Hoodies", "🧶"],
  ["Footwear", "👟"],
  ["Accessories", "👜"],
];

const testimonials = [
  {
    name: "Maya R.",
    initials: "MR",
    text: "ClothSwap completely changed how I shop. I found amazing pieces without spending a cent.",
  },
  {
    name: "Jordan K.",
    initials: "JK",
    text: "It feels great knowing my old clothes are being loved instead of ending up in a landfill.",
  },
  {
    name: "Sofia L.",
    initials: "SL",
    text: "The community is friendly, reliable, and full of unique fashion finds.",
  },
];

function Stat({ value, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(value / 60);

    const timer = setInterval(() => {
      current += increment;

      if (current >= value) {
        current = value;
        clearInterval(timer);
      }

      setCount(current);
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {count.toLocaleString()}+
      </div>
      <div className="mt-2 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      return null;
    }
  });
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

    if (!result.isConfirmed) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setProfileOpen(false);

    await Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 1200,
      showConfirmButton: false,
    });
  };
  const handleDashboard = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const role = String(user.role || user.user_role || "").toUpperCase();

    if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else {
      navigate("/dashboard");
    }

    setProfileOpen(false);
  };
  const handleBrowseClothes = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/browse-clothes");
  };
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg text-white shadow-lg shadow-emerald-500/20">
              ✦
            </span>
            Cloth<span className="text-emerald-500">Swap</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <Link className="transition hover:text-emerald-500" to="/">
              Home
            </Link>
            <button
              type="button"
              onClick={handleBrowseClothes}
              className="transition hover:text-emerald-500 cursor-pointer"
            >
              Browse Clothes
            </button>
            <Link className="transition hover:text-emerald-500" to="#about">
              About
            </Link>
            <Link
              className="transition hover:text-emerald-500"
              to="#how-it-works"
            >
              How It Works
            </Link>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 cursor-pointer"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 cursor-pointer"
                >
                  {(user.full_name || user.name || "User")
                    .charAt(0)
                    .toUpperCase()}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-14 z-50 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="border-b border-slate-100 px-3 py-3">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.full_name || user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {user.role || user.user_role || "CUSTOMER"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="mt-1 flex w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      📊 Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            aria-label="Toggle navigation"
            className="rounded-lg p-2 text-slate-700 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-4 text-sm font-medium text-slate-600">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <button type="button" onClick={handleBrowseClothes}>
                Browse Clothes
              </button>
              <Link to="#about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link to="#how-it-works" onClick={() => setMenuOpen(false)}>
                How It Works
              </Link>
              {!user ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/register");
                      setMenuOpen(false);
                    }}
                    className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
                      {(user.full_name || user.name || "User")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {user.full_name || user.name || "User"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {user.role || user.user_role || "CUSTOMER"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleDashboard();
                      setMenuOpen(false);
                    }}
                    className="rounded-full bg-emerald-50 px-5 py-3 text-left font-semibold text-emerald-700"
                  >
                    📊 Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="rounded-full bg-red-50 px-5 py-3 text-left font-semibold text-red-600"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <main>
        <section
          id="home"
          className="relative isolate bg-linear-to-br from-emerald-50 via-white to-slate-50"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Fashion with a future
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.06em] text-slate-950 sm:text-7xl">
                Exchange Clothes.
                <br />
                <span className="text-emerald-500">Save Money.</span>
                <br />
                Save the Planet.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Join a sustainable fashion community where people exchange
                clothes instead of buying new ones.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-1 hover:bg-emerald-600">
                  Get Started
                  <ArrowIcon />
                </button>
                <button
                  type="button"
                  onClick={handleBrowseClothes}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-emerald-600"
                >
                  Browse Clothes
                  <ArrowIcon />
                </button>
              </div>

              <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
                <div className="flex -space-x-3">
                  {["👩🏻", "👨🏽", "👩🏾", "👨🏻"].map((avatar, index) => (
                    <span
                      key={index}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-lg"
                    >
                      {avatar}
                    </span>
                  ))}
                </div>
                <span>
                  <strong className="text-slate-900">5,000+</strong> conscious
                  members already swapping
                </span>
              </div>
            </div>

            <div className="relative mx-auto flex h-107.5 w-full max-w-xl items-center justify-center">
              <div className="absolute h-72 w-72 rounded-full bg-emerald-200 sm:h-96 sm:w-96" />
              <div className="absolute h-80 w-80 rounded-full border border-emerald-300/60 sm:h-108 sm:w-108" />

              <div className="relative z-10 flex items-center text-[7rem] drop-shadow-2xl sm:text-[10rem]">
                <span>👩🏽‍🦱</span>
                <span className="-mx-4 rounded-3xl bg-white p-4 text-5xl shadow-2xl sm:text-6xl">
                  👕
                </span>
                <span>🧑🏻‍🦰</span>
              </div>

              <div className="absolute right-0 top-12 z-20 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-bold shadow-xl backdrop-blur-lg">
                🌿 100% Circular
              </div>
              <div className="absolute bottom-10 left-0 z-20 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-bold shadow-xl backdrop-blur-lg">
                ♻️ Swap. Repeat. Inspire.
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Why ClothSwap
              </p>
              <h2 className="text-4xl font-bold tracking-tighter text-slate-950 sm:text-6xl">
                A better way to
                <br />
                <span className="font-serif italic text-emerald-500">
                  refresh your style.
                </span>
              </h2>
            </div>
            <p className="max-w-md text-lg leading-8 text-slate-500">
              Every swap is a small step toward a cleaner planet. Discover
              clothes you love, meet like-minded people, and make fashion more
              circular.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/10"
              >
                <div className="mb-12 text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.text}
                </p>
                <div className="mt-6 text-right text-xl text-emerald-500 transition group-hover:translate-x-1">
                  ↗
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Simple by design
                </p>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl">
                  How it{" "}
                  <span className="font-serif italic text-emerald-500">
                    works
                  </span>
                </h2>
              </div>
              <p className="max-w-sm text-slate-500">
                From closet to community in four easy steps.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-4">
              {steps.map(([number, title, text]) => (
                <article
                  key={number}
                  className="border-t border-slate-300 pt-6"
                >
                  <span className="text-sm font-bold text-emerald-600">
                    {number}
                  </span>
                  <h3 className="mt-8 text-lg font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="browse" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Find your next favorite
              </p>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl">
                Browse by{" "}
                <span className="font-serif italic text-emerald-500">
                  category
                </span>
              </h2>
            </div>
            <button
              type="button"
              onClick={handleBrowseClothes}
              className="font-bold text-slate-700 hover:text-emerald-600"
            >
              View all clothes ↗
            </button>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map(([name, icon]) => (
              <button
                type="button"
                onClick={handleBrowseClothes}
                key={name}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-36 items-center justify-center bg-emerald-50 text-7xl transition group-hover:bg-emerald-100">
                  {icon}
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{name}</h3>
                  <span className="mt-2 block text-xs font-medium text-slate-500 group-hover:text-emerald-600">
                    Explore swaps ↗
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-emerald-500 px-6 py-20 text-white">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-12 sm:grid-cols-4">
            <Stat value={5000} label="Users" />
            <Stat value={12000} label="Listings" />
            <Stat value={4500} label="Successful Swaps" />
            <Stat value={20} label="Cities" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Loved by the community
          </p>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl">
            Real people.
            <br />
            <span className="font-serif italic text-emerald-500">
              Real impact.
            </span>
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {testimonials.map((review) => (
              <article
                key={review.name}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="text-lg tracking-widest text-amber-400">
                  ★★★★★
                </div>
                <p className="mt-6 min-h-28 text-lg leading-8 text-slate-600">
                  “{review.text}”
                </p>
                <div className="mt-7 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {review.initials}
                  </div>
                  <div>
                    <strong className="block text-sm">{review.name}</strong>
                    <span className="text-xs text-slate-500">
                      Verified member
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-6 mb-24 overflow-hidden rounded-4xl bg-linear-to-r from-emerald-50 via-white to-slate-100 px-8 py-20 sm:px-16 lg:mx-auto lg:max-w-7xl lg:px-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Your closet has more to give
              </p>

              <h2 className="max-w-2xl text-4xl font-bold tracking-tighter text-slate-950 sm:text-6xl">
                Ready to make your
                <br />
                <span className="font-serif italic text-emerald-500">
                  next great swap?
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-500">
                Join thousands of people choosing better fashion, together.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-1 hover:bg-emerald-600"
                >
                  Register Now
                  <ArrowIcon />
                </button>
              </div>
            </div>

            <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-emerald-200/70 sm:h-72 sm:w-72">
              <div className="absolute inset-5 rounded-full border border-emerald-300" />
              <div className="relative text-8xl drop-shadow-xl">🌿</div>
              <div className="absolute -right-2 top-8 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm font-bold shadow-lg backdrop-blur">
                Better choices
              </div>
              <div className="absolute -bottom-3 -left-5 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm font-bold shadow-lg backdrop-blur">
                Better future
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg text-white">
                ✦
              </span>
              Cloth<span className="text-emerald-500">Swap</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
              Fashion that moves forward. Discover, exchange, and make a
              positive impact together.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">Quick Links</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
              <button
                type="button"
                onClick={handleBrowseClothes}
                className="transition hover:text-emerald-600"
              >
                Browse Clothes
              </button>
              <Link
                className="transition hover:text-emerald-600"
                to="/how-it-works"
              >
                How It Works
              </Link>
              <Link className="transition hover:text-emerald-600" to="/about">
                About Us
              </Link>
              <Link className="transition hover:text-emerald-600" to="/">
                Sustainability
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">Contact</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
              <a
                className="transition hover:text-emerald-600"
                href="mailto:hello@clothswap.com"
              >
                hello@clothswap.com
              </a>
              <span>Community Center</span>
              <span>Mon–Fri, 9am–6pm</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">Follow Along</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
              <a className="transition hover:text-emerald-600" href="#home">
                Instagram ↗
              </a>
              <a className="transition hover:text-emerald-600" href="#home">
                TikTok ↗
              </a>
              <a className="transition hover:text-emerald-600" href="#home">
                Pinterest ↗
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-6 text-xs text-slate-500 sm:flex-row lg:px-8">
            <span>© 2025 ClothSwap. All rights reserved.</span>
            <div className="flex gap-5">
              <a className="hover:text-emerald-600" href="#home">
                Privacy Policy
              </a>
              <a className="hover:text-emerald-600" href="#home">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
