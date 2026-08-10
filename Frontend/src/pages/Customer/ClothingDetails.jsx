import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getClothingById } from "../../services/clothingServices";
import {
  ArrowLeft,
  Heart,
  Image as ImageIcon,
  MapPin,
  Repeat2,
  Star,
} from "lucide-react";
import DashboardLayout from "../../components/DashbaordLayout";
export default function ClothingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [clothing,setClothing] = useState(null);
  const [loading,setLoading] = useState(true);
  const [user] = useState(()=>{
    const storedUser = localStorage.getItem("user");
    return storedUser?JSON.parse(storedUser):null;
  });
  useEffect(()=>{
      const fetchClothing = async()=>{
        try{
          const response = await getClothingById(id);
          setClothing(response.data.clothing);
        }catch(error){
            console.log(error);
            toast.error(error.response?.data?.message || "Unable to get the clothing");
        }finally{
            setLoading(false);
        }
    };
    fetchClothing();
  },[id]);
  if (loading) {
  return (
    <DashboardLayout user={user} showNavbar={false}>
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading clothing details...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
  }
  if (!clothing) {
  return (
    <DashboardLayout user={user} showNavbar={false}>
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Clothing not found
          </h2>

          <button
            onClick={() => navigate("/browse-clothes")}
            className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Back to Browse
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
  }
  return (
    <DashboardLayout user={user} showNavbar={true}>
      <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button onClick={()=>navigate("/browse-clothes")} className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-700">
            <ArrowLeft size={18} />
            Back to Browse Clothes
          </button>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex min-h-105 items-center justify-center rounded-3xl bg-white p-6 shadow-sm lg:min-h-155">
              <div className="flex h-full min-h-95 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-3 h-16 w-16" />
                  <p className="text-sm">Clothing image placeholder</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {clothing.status}
                  </span>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                    {clothing.title}
                  </h1>

                  <p className="mt-2 text-slate-500">
                    {clothing.brand} · {clothing.category}
                  </p>
                </div>

                <button
                  aria-label="Favorite clothing"
                  className="rounded-full border border-slate-200 p-3 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
                >
                  <Heart size={21} />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  {clothing.size}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  {clothing.clothing_condition}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  {clothing.color}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                  {clothing.gender}
                </span>
              </div>

              <div className="mt-8 rounded-2xl bg-emerald-50 p-5">
                <p className="text-sm font-medium text-emerald-700">
                  Estimated value
                </p>
                <p className="mt-1 text-3xl font-bold text-emerald-800">
                 {clothing.estimated_value? `₹${clothing.estimated_value}`: "Not specified"}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900">
                  Description
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {clothing.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-slate-600">
                <MapPin className="text-emerald-600" size={19} />
                <span>
                  {clothing.city || "Location Unavailable"}, {clothing.state && `,${clothing.state}`}
                </span>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                    {clothing.owner_name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {clothing.owner_name}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Star
                          size={15}
                          className="fill-amber-400 text-amber-400"
                        />
                        {clothing.owner_rating || "New"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Repeat2 size={15} />
                        {clothing.owner_completed_swaps || 0} completed swaps
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="mt-8 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 cursor-pointer">
                Send Swap Request
              </button>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}