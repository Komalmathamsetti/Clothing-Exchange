import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getClothingById, getMyListings } from "../../services/clothingServices";
import { createSwapRequest } from "../../services/swapServices";
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
  const [showSwapModal,setShowSwapModal] = useState(false);
  const [myClothes,setMyClothes] = useState([]);
  const [selectedItem,setSelectedItem] = useState("");
  const [message,setMessage] = useState("");
  const [swapLoading,setSwapLoading] = useState(false);
  const [user] = useState(()=>{
    const storedUser = localStorage.getItem("user");
    return storedUser?JSON.parse(storedUser):null;
  });
  const openSwapModal = async () => {
  try {
    const response = await getMyListings();

    console.log(
      "MY LISTINGS RESPONSE:",
      JSON.stringify(response.data, null, 2)
    );

    setMyClothes(response.data.listings || []);
    setShowSwapModal(true);

  } catch (error) {
    console.log("MY LISTINGS ERROR:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to load your clothes"
    );
  }
  };
  const handleSendSwapRequest = async()=>{
    if(!selectedItem){
      toast.error("Please select a clothing item");
      return;
    }
    try{
      setSwapLoading(true);
      const response = await createSwapRequest({
        reciever_id:Number(clothing.owner_id),
        sender_item_id:Number(selectedItem),
        reciever_item_id:Number(clothing.id),
        message:message.trim()||null,
      });
      toast.success(response.data.message || "Swap request sent successfully");
      setShowSwapModal(false);
      setSelectedItem("");
      setMessage("");
    }catch(error){
      console.log("SEND SWAP REQUEST ERROR:",error);
      toast.error(error.response?.data?.message || "Failed to send swap request");
    }finally{
      setSwapLoading(false);
    }
  };
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

              <button type="button" disabled={clothing.status?.toUpperCase() !== "AVAILABLE"}
              onClick={openSwapModal}
              className="mt-8 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 cursor-pointer">
                Send Swap Request
              </button>
            </div>
          </div>
        </div>
      </main>
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Send Swap Request
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose one of your clothes to offer.
                </p>
              </div>
              <button
              type="button"
              onClick={() => setShowSwapModal(false)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                ✕
              </button>
            </div>
            {/* Requested clothing */}
            <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                You want
              </p>
              <p className="mt-1 font-bold text-slate-900">
                {clothing.title}
              </p>
              <p className="text-sm text-slate-500">
                {clothing.brand} · {clothing.size}
              </p>
            </div>
            {/* My clothes */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Choose your clothing
              </label>
              <select value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                <option value="">Select a clothing item</option>
                {myClothes.map((item) => (
  <option
    key={item.id}
    value={item.id}
  >
    {item.title} — {item.size} —{" "}
    {item.clothing_condition}
  </option>
))}
              </select>
            </div>
            {/* Message */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Message
              <span className="font-normal text-slate-400">
                {" "}
                (optional)
              </span>
              </label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write a message to the owner..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"/>
            </div>
            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowSwapModal(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" disabled={!selectedItem || swapLoading} onClick={handleSendSwapRequest}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                {swapLoading ? "Sending..." : "Send Request"}
              </button>
            </div>
            </div>
            </div>
          )}
    </DashboardLayout>
  );
}