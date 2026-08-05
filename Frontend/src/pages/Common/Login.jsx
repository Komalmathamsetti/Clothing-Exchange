import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authServices";
import toast from "react-hot-toast";
export default function Login() {
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    email:"",
    password:""
  });
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    });
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      const response = await loginUser(formData);
      toast.success(response.data.message);
      localStorage.setItem("token",response.data.token);
      localStorage.setItem("user",JSON.stringify(response.data.user));
      navigate("/dashboard");
    }catch(error){
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-200">
            C
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Cloth<span className="text-emerald-600">Swap</span>
          </span>
        </Link>

        <Link
          to="/"
          className="text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          Home
        </Link>
      </nav>

      <section className="mx-auto mt-8 grid max-w-7xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-200 lg:grid-cols-2">
        <div className="flex items-center px-6 py-12 sm:px-12 lg:px-16 lg:py-20">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-9">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Welcome back to ClothSwap
              </p>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Welcome Back
              </h1>

              <p className="mt-4 max-w-md leading-7 text-slate-500">
                Login to continue swapping clothes and helping build a
                sustainable fashion community.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-500">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-emerald-600 focus:ring-emerald-500"
                />
                Remember me
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl"
              >
                Login
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Or
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-5 py-4 font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="text-lg font-black text-blue-500">G</span>
                Continue with Google
              </button>
            </form>

            <p className="mt-9 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-emerald-600 transition hover:text-emerald-700"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden min-h-175 overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-800 to-teal-700 lg:block">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <div className="max-w-md">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                Fashion with purpose
              </span>

              <h2 className="mt-8 text-5xl font-black leading-tight tracking-tight">
                Your style is always in season.
              </h2>

              <p className="mt-6 text-lg leading-8 text-emerald-50/80">
                Reconnect with your wardrobe, discover something new, and keep
                great clothing in circulation.
              </p>
            </div>

            <div className="relative mx-auto h-90 w-full max-w-md">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl" />

              <div className="absolute left-10 top-12 h-40 w-36 -rotate-12 rounded-4xl rounded-br-[5rem] bg-linear-to-br from-orange-200 to-rose-300 shadow-2xl">
                <div className="absolute left-8 top-12 h-16 w-16 rounded-full border-4 border-white/50" />
              </div>

              <div className="absolute right-8 top-20 h-44 w-32 rotate-12 rounded-t-[3rem] rounded-b-2xl bg-linear-to-br from-sky-200 to-indigo-300 shadow-2xl">
                <div className="absolute left-10 top-10 h-20 w-12 rounded-full bg-white/30" />
              </div>

              <div className="absolute bottom-4 left-1/2 h-48 w-40 -translate-x-1/2 rounded-t-[4rem] rounded-b-3xl bg-linear-to-br from-emerald-200 to-lime-300 shadow-2xl">
                <div className="absolute left-12 top-12 h-24 w-16 rounded-full border-4 border-white/50" />
              </div>

              <div className="absolute bottom-0 left-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-xs text-emerald-100">Community impact</p>
                <p className="mt-1 text-xl font-black">10k+ swaps</p>
              </div>

              <div className="absolute right-0 top-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-xs text-emerald-100">Circular fashion</p>
                <p className="mt-1 text-xl font-black">One swap at a time</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-white/15 pt-6 text-sm text-emerald-50/80">
              <span className="h-2 w-2 rounded-full bg-lime-300" />
              Good clothes deserve another story
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}