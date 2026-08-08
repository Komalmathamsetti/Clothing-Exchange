import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getClothingById,getCategories,updateClothing } from "../../services/clothingServices";
import DashboardLayout from "../../components/DashbaordLayout";
export default function EditClothing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [categories,setCategories] = useState([]);
  const [formData,setFormData] = useState({
    category_id:"",
    title:"",
    description:"",
    brand:"",
    size:"",
    clothing_condition:"",
    color:"",
    gender:"",
    estimated_value:"",
    city:"",
    state:""
  });
  const [laoding,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
   if (loading) {
    return (
      <DashboardLayout user={user} showNavbar={true}>
        <main className="min-h-[calc(100vh-86px)] bg-slate-50">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading clothing details...
              </p>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Your Wardrobe
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Edit Listing
            </h1>

            <p className="mt-3 text-slate-500">
              Update the details of your clothing item.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600"
          >
            <span className="text-lg">←</span>
            Back to Listings
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          {/* Basic Information */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep the main information about your listing up to date.
              </p>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Clothing Title
                </label>
                <input
                  type="text"
                  defaultValue="Classic Denim Jacket"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select
                  defaultValue="Jackets"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option>Shirts</option>
                  <option>T-Shirts</option>
                  <option>Jeans</option>
                  <option>Dresses</option>
                  <option>Jackets</option>
                  <option>Hoodies</option>
                  <option>Footwear</option>
                  <option>Accessories</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows="5"
                  defaultValue="A timeless blue denim jacket in excellent condition. Comfortable, versatile, and perfect for everyday layering."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </section>

          <div className="my-10 border-t border-slate-100" />

          {/* Clothing Details */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Clothing Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add accurate details to help members find your item.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Brand
                </label>
                <input
                  type="text"
                  defaultValue="Levi's"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Size
                </label>
                <select
                  defaultValue="M"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>XXL</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Condition
                </label>
                <select
                  defaultValue="Like New"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Color
                </label>
                <input
                  type="text"
                  defaultValue="Deep Blue"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <select
                  defaultValue="Unisex"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option>Men</option>
                  <option>Women</option>
                  <option>Unisex</option>
                </select>
              </div>
            </div>
          </section>

          <div className="my-10 border-t border-slate-100" />

          {/* Swap Value */}
          <section>
            <h2 className="text-lg font-bold text-slate-900">Swap Value</h2>
            <p className="mt-1 text-sm text-slate-500">
              Set an approximate value for your clothing item.
            </p>

            <div className="mt-6 max-w-md">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Estimated Swap Value
              </label>

              <div className="flex overflow-hidden rounded-xl border border-slate-200 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                <span className="flex items-center bg-slate-50 px-4 text-slate-500">
                  ₹
                </span>
                <input
                  type="number"
                  defaultValue="1800"
                  className="w-full px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
            </div>
          </section>

          <div className="my-10 border-t border-slate-100" />

          {/* Location */}
          <section>
            <h2 className="text-lg font-bold text-slate-900">Location</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the location where the exchange can take place.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <input
                type="text"
                defaultValue="Mumbai"
                placeholder="City"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <input
                type="text"
                defaultValue="Maharashtra"
                placeholder="State"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </section>

          <div className="my-10 border-t border-slate-100" />

          {/* Photos */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Photos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage the photos shown on your clothing listing.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {existingImages.map((image, index) => (
                <div
                  key={image}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src={image}
                    alt={`Clothing preview ${index + 1}`}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-md transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                      Cover photo
                    </span>
                  )}
                </div>
              ))}

              {/* Add More Photos */}
              <div className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
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

                <p className="font-semibold text-slate-800">
                  Add more photos
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPG or WEBP
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Up to 5 photos
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}