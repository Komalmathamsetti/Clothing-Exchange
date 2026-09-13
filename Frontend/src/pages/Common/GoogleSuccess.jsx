import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Google login failed");
      navigate("/login");
      return;
    }

    try {
      // Save JWT
      localStorage.setItem("token", token);

      // We need the user information separately.
      // The dashboard/profile APIs can load it after authentication.
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("GOOGLE SUCCESS ERROR:", error);

      toast.error("Google login failed");
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

        <h1 className="text-xl font-bold text-slate-900">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Please wait while we complete your Google login.
        </p>
      </div>
    </div>
  );
}