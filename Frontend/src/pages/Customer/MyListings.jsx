import DashboardLayout from "../../components/DashbaordLayout";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyListings } from "../../services/clothingServices";
export default function MyListings() {
  const navigate = useNavigate();
  const [user] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
  });
  const [listings,setListings] = useState([]);
  const [loading,setLoading] = useState(true);
  const fetchListings = async()=>{
    try{
      setLoading(true);
      const response = await getMyListings();
      setListings(response.data.listings || []);
    }catch(error){
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to ypu listings");
    }finally{
      setLoading(false);
    }
  };
  useEffect(()=>{
    const loadListings = async()=>{
      await fetchListings();
    };
    loadListings();
  },[]);
  return (
    <DashboardLayout user={user} showNavbar={true}>
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {loading ? (
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading your listings...
              </p>
            </div>
          </div>
          ) : (
          <>
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Your Wardrobe
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Listings
            </h1>

            <p className="mt-3 text-slate-500">
              Manage the clothes you've shared with the ClothSwap community.
            </p>
          </div>

          <button
            type="button"
            onClick={()=>navigate("/add-clothing")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30 cursor-pointer"
          >
            <span className="text-xl leading-none">+</span>
            Add Clothing
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Listings</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{listings.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active Listings</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{listings.filter((item)=>item.status === "AVAILABLE").length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Items Exchanged</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{listings.filter((item)=>item.status==="EXCHANGED").length}</p>
          </div>
        </div>

        {/* Listings Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Shared with the community
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your recently added clothing items.
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              {listings.length} {listings.length === 1 ? "listing" : "listings"}
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_0.8fr] gap-4 bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
              <span>Item</span>
              <span>Category</span>
              <span>Condition</span>
              <span>Size</span>
              <span>Swap Value</span>
              <span>Status</span>
            </div>

            {listings.map((listing) => (
              <div
                key={listing.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_0.8fr] items-center gap-4 border-t border-slate-100 px-5 py-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                 <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 text-2xl">👕</div>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-900">
                      {listing.title}
                    </h3>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {listing.city || "Location not specified"}{listing.state && `, ${listing.state}`}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-slate-600">
                  {listing.category || "-"}
                </span>

                <span className="text-sm text-slate-600">
                  {listing.clothing_condition || "-"}
                </span>

                <span className="text-sm font-semibold text-slate-700">
                  {listing.size || "-"}
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {listing.estimated_value != null? `₹${listing.estimated_value}`: "—"}
                </span>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                     listing.status === "AVAILABLE"
                     ? "bg-emerald-50 text-emerald-700"
                     : listing.status === "EXCHANGED"
                     ? "bg-blue-50 text-blue-700"
                     : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {listing.status}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {listings.map((listing) => (
              <article
                key={listing.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 text-2xl">👕</div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-slate-900">
                        {listing.title || "-"}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          listing.status === "AVAILABLE"
                          ? "bg-emerald-50 text-emerald-700"
                          : listing.status === "EXCHANGED"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {listing.city || "Location not specified"}{listing.state && `, ${listing.state}`}
                    </p>

                    <p className="mt-3 text-sm font-bold text-slate-900">
                      {listing.estimated_value != null? `₹${listing.estimated_value}`: "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[11px] text-slate-400">Category</p>
                    <p className="mt-1 text-xs font-semibold text-slate-700">
                      {listing.category || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Condition</p>
                    <p className="mt-1 text-xs font-semibold text-slate-700">
                      {listing.clothing_condition || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Size</p>
                    <p className="mt-1 text-xs font-semibold text-slate-700">
                      {listing.size || "-"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Static Empty Space / Footer Hint */}
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <h3 className="font-bold text-slate-800">
              Have more clothes to share?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Add another item and help someone find their next favorite piece.
            </p>
          </div>
        </section>
        </>
      )}
      </div>
    </main>
    </DashboardLayout>
  );
}