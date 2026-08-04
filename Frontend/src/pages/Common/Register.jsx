import { useMemo, useState } from "react";
import {registerUser} from "../../services/authServices";
import { useNavigate,Link } from "react-router-dom";
import toast from "react-hot-toast";
export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    state: "",
    role: "user",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const passwordStrength = useMemo(() => {
    const password = form.password;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }, [form.password]);

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = [
    "bg-slate-200",
    "bg-red-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-600",
  ][passwordStrength];

  const isValid =
    form.fullName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.phone.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.role;

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSubmitted(true);

  if (!isValid) {
    toast.error("Please fill all fields correctly.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await registerUser({
      full_name: form.fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      city: form.city,
      state: form.state,
      role: form.role,
    });

    toast.success(response.data.message);

    navigate("/login");

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message || "Registration Failed"
    );

  } finally {

    setIsLoading(false);

  }
  };
  const fieldClass =
    "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-slate-100 px-4 py-6 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-4xl border border-white/80 bg-white/70 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl lg:grid-cols-2">
          <section className="order-2 px-6 py-10 sm:px-12 lg:order-1 lg:px-16 lg:py-14">
            <div className="mx-auto max-w-xl">
              <a
                href="/"
                className="mb-10 inline-flex items-center gap-2 text-xl font-bold tracking-tight"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg text-white shadow-lg shadow-emerald-500/20">
                  ✦
                </span>
                Cloth<span className="text-emerald-500">Swap</span>
              </a>

              <div className="mb-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Join the movement
                </p>
                <h1 className="text-4xl font-bold tracking-tighter text-slate-950 sm:text-5xl">
                  Create your
                  <br />
                  <span className="font-serif italic text-emerald-500">
                    sustainable account.
                  </span>
                </h1>
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Join a community making fashion more circular, affordable,
                  and meaningful.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    placeholder="Alex Morgan"
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      placeholder="you@example.com"
                      onChange={(e) => updateField("email", e.target.value)}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      placeholder="+1 555 000 0000"
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        placeholder="Minimum 8 characters"
                        onChange={(e) => updateField("password", e.target.value)}
                        className={`${fieldClass} pr-16`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 transition hover:text-emerald-600"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    <div className="mt-2 flex gap-1">
                      {[0, 1, 2, 3].map((level) => (
                        <span
                          key={level}
                          className={`h-1.5 flex-1 rounded-full ${
                            passwordStrength > level
                              ? strengthColor
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    {form.password && (
                      <p className="mt-1 text-xs text-slate-500">
                        Password strength:{" "}
                        <span className="font-semibold">{strengthLabel}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        placeholder="Repeat password"
                        onChange={(e) =>
                          updateField("confirmPassword", e.target.value)
                        }
                        className={`${fieldClass} pr-16`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 transition hover:text-emerald-600"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    {submitted &&
                      form.password !== form.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">
                          Passwords do not match.
                        </p>
                      )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      placeholder="New York"
                      onChange={(e) => updateField("city", e.target.value)}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      State
                    </label>
                    <input
                      type="text"
                      value={form.state}
                      placeholder="NY"
                      onChange={(e) => updateField("state", e.target.value)}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Role
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="flex items-center gap-4 py-1">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span className="text-lg font-bold text-red-500">G</span>
                  Continue with Google
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-emerald-600 transition hover:text-emerald-700"
                >
                  Login
                </Link>
              </p>
            </div>
          </section>

          <section className="relative order-1 hidden min-h-195 overflow-hidden bg-linear-to-br from-emerald-500 to-emerald-700 lg:order-2 lg:flex lg:items-center lg:justify-center">
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 -left-24 h-120 w-120 rounded-full bg-emerald-300/20" />

            <div className="relative z-10 px-12 text-center">
              <div className="relative mx-auto flex h-96 w-96 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                <div className="absolute h-72 w-72 rounded-full bg-emerald-300/50" />

                <div className="relative z-10 flex items-center text-[7rem] drop-shadow-2xl">
                  <span>👩🏽‍🦱</span>
                  <span className="-mx-5 rounded-3xl bg-white p-4 text-5xl shadow-2xl">
                    👕
                  </span>
                  <span>🧑🏻‍🦰</span>
                </div>

                <div className="absolute -right-10 top-12 rounded-2xl border border-white/30 bg-white/20 px-5 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-lg">
                  ♻️ Circular style
                </div>

                <div className="absolute -bottom-5 -left-12 rounded-2xl border border-white/30 bg-white/20 px-5 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-lg">
                  🌿 Shared impact
                </div>
              </div>

              <h2 className="mt-14 text-4xl font-bold tracking-[-0.04em] text-white">
                Your style can make
                <br />
                <span className="font-serif italic text-emerald-100">
                  a difference.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-md leading-7 text-emerald-50/90">
                Exchange what you have, discover what you love, and help build
                a more sustainable fashion future.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}