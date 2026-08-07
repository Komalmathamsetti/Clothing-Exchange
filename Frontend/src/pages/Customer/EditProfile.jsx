import DashboardLayout from "../../components/DashbaordLayout";
import {useState,useEffect} from "react";
import {Link,useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getProfile,updateProfile,changePassword,deleteAccount } from "../../services/userServices";
export default function EditProfile() {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(true);
  const [user,setUser] = useState(null);
  const [form,setForm] = useState({
    full_name:"",
    email:"",
    phone:"",
    city:"",
    state:""
  });
  const [passwordData,setPasswordData] = useState({
    oldPassword:"",
    newPassword:"",
    confirmPassword:""
  });
  const fetchProfile = async()=>{
    try{
      const response = await getProfile();
      setUser(response.data.user);
      setForm({
        full_name:response.data.user.full_name,
        email:response.data.user.email,
        phone:response.data.user.phone,
        city: response.data.user.city || "",
        state: response.data.user.state || "",
        role: response.data.user.role,
      });
    }catch(error){
      toast.error(error.response?.data?.message);
    }finally{
      setLoading(false);
    }
  };
  useEffect(()=>{
    const loadProfile = async()=>{
      await fetchProfile();
    };
    loadProfile();
  },[]);
  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value,
    });
  };
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      const response = await updateProfile(form);
      toast.success(response.data.message);
      setUser(response.data.user);
    }catch(error){
      toast.error(error.response?.data?.message);
    }
  };
  const handlePasswordSubmit = async(e)=>{
    e.preventDefault();
    if(passwordData.newPassword !== passwordData.confirmPassword){
      return toast.error("Passwords do not match");
    }
    try{
      const response = await changePassword({
        oldPassword:passwordData.oldPassword,
        newPassword:passwordData.newPassword
      });
      toast.success(response.data.message);
      setPasswordData({
        oldPassword:"",
        newPassword:"",
        confirmPassword:"",
      });
    }catch(error){
      toast.error(error.response?.data?.message);
    }
  };
  const handleDelete = async () => {
  const result = await Swal.fire({
    title: "Delete Account?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#10b981",
    confirmButtonText: "Delete",
  });
  if (!result.isConfirmed) return;
  try {
    const response = await deleteAccount();
    toast.success(response.data.message);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  };
  if(loading){
    return(
    <div className="flex h-screen items-center justify-center">
    <h1 className="text-2xl font-bold">
      Loading...
    </h1>
    </div>
    );
  }
  return (
    <DashboardLayout user={user} showNavbar={false}>
    <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl space-y-8 p-5 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Account Settings</p>
              <h1 className="mt-1 text-4xl font-bold text-slate-900">Edit Profile</h1>
              <p className="mt-2 text-slate-500">Keep your profile information up to date.</p>
            </div>
            <button type="button" onClick={() => navigate("/profile")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600">
              ← Back
            </button>
          </div>
          <form onSubmit={handleSubmit}>
          <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h3 className="text-lg font-bold">Personal Information</h3>
              <p className="mt-1 text-sm text-slate-400">
                Update your public profile details.
              </p>
            </div>

            <div className="mb-8 flex flex-col items-center gap-5 rounded-2xl bg-slate-50/80 p-6 sm:flex-row">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-white bg-linear-to-br from-emerald-100 via-teal-100 to-slate-200 text-3xl font-bold text-emerald-700 shadow-lg">
                {user?.full_name?.charAt(0).toUpperCase()}
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
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
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
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-400 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={()=>navigate("/profile")}
                className="rounded-xl border border-slate-200 px-6 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </section>
          </form>
          <form onSubmit={handlePasswordSubmit}>
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
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
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
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
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
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  placeholder="Confirm new password"
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <button
                type="submit"
                className="inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 hover:bg-slate-800"
              >
                Update Password
              </button>
            </div>
          </section>
          </form>
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

            <button
              onClick={handleDelete}
              className="shrink-0 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100"
            >
              Delete Account
            </button>
          </section>

          <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row">
            <p>© 2024 ClothSwap. Make fashion circular.</p>
            <div className="flex gap-5">
              <Link to="/help" className="hover:text-emerald-600">
                Help Center
              </Link>
              <Link to="/privacy" className="hover:text-emerald-600">
                Privacy
              </Link>
              <Link to="/terms-conditions" className="hover:text-emerald-600">
                Terms
              </Link>
            </div>
          </footer>
        </div>
    </div>
    </DashboardLayout>
  );
}