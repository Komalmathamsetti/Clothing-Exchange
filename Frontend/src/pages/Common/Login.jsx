import { useState } from "react";
import {loginUser} from "../../services/authServices";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const formValid = emailValid && passwordValid;

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!formValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const inputStyle = (valid) =>
    `w-full rounded-2xl border bg-white/80 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
      submitted && !valid
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
    }`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-5 py-6 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl lg:grid-cols-2">
          <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-20 lg:py-20">
            <div className="w-full max-w-md">
              <a
                href="/"
                className="mb-14 inline-flex items-center gap-2 text-xl font-bold tracking-tight"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg text-white shadow-lg shadow-emerald-500/20">
                  ✦
                </span>
                Cloth<span className="text-emerald-500">Swap</span>
              </a>

              <div className="mb-9">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Welcome back
                </p>
                <h1 className="text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl">
                  Login to your
                  <br />
                  <span className="font-serif italic text-emerald-500">
                    sustainable closet.
                  </span>
                </h1>
                <p className="mt-5 leading-7 text-slate-500">
                  Login to continue exchanging clothes and supporting
                  sustainable fashion.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputStyle(emailValid)}
                    aria-invalid={submitted && !emailValid}
                  />
                  {submitted && !emailValid && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Enter your password"
                      onChange={(event) => setPassword(event.target.value)}
                      className={`${inputStyle(passwordValid)} pr-20`}
                      aria-invalid={submitted && !passwordValid}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 transition hover:text-emerald-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {submitted && !passwordValid && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      Password must contain at least 6 characters.
                    </p>
                  )}
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-500 accent-emerald-500 focus:ring-emerald-500"
                  />
                  Remember me
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <div className="flex items-center gap-4 py-1">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span className="text-lg font-bold text-red-500">G</span>
                  Continue with Google
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-bold text-emerald-600 transition hover:text-emerald-700"
                >
                  Register
                </a>
              </p>
            </div>
          </section>

          <section className="relative hidden min-h-[720px] overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 lg:flex lg:items-center lg:justify-center">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-300/20" />
            <div className="absolute left-16 top-20 h-5 w-5 rounded-full bg-white/40" />
            <div className="absolute right-24 top-40 h-3 w-3 rounded-full bg-white/50" />

            <div className="relative z-10 px-12 text-center">
              <div className="relative mx-auto flex h-96 w-96 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                <div className="absolute h-72 w-72 rounded-full bg-emerald-300/50" />

                <div className="relative z-10 flex items-center text-[8rem] drop-shadow-2xl">
                  <span>👩🏽‍🦱</span>
                  <span className="-mx-5 rounded-3xl bg-white p-4 text-5xl shadow-2xl">
                    👕
                  </span>
                  <span>🧑🏻‍🦰</span>
                </div>

                <div className="absolute -right-10 top-12 rounded-2xl border border-white/30 bg-white/20 px-5 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-lg">
                  ♻️ Circular fashion
                </div>

                <div className="absolute -bottom-5 -left-12 rounded-2xl border border-white/30 bg-white/20 px-5 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-lg">
                  🌿 Better together
                </div>
              </div>

              <h2 className="mt-14 text-4xl font-bold tracking-[-0.04em] text-white">
                Good style should
                <br />
                <span className="font-serif italic text-emerald-100">
                  never go to waste.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-md leading-7 text-emerald-50/90">
                Discover unique pieces, connect with your community, and make
                every outfit part of a more sustainable future.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}