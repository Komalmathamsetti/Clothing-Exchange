import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createClothing,getCategories } from "../../services/clothingServices";
import DashboardLayout from "../../components/DashbaordLayout";
export default function AddClothing() {
  const navigate = useNavigate();
  const [categories,setCategories] = useState([]);
  const [user] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
  });
  const [formData,setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    brand: "",
    size: "",
    clothing_condition: "",
    color: "",
    gender: "",
    estimated_value: "",
    city: "",
    state: "",
  });
  const [loading,setLoading] = useState(false);
  useEffect(()=>{
    const fetchCategories = async()=>{
      try{
        const response = await getCategories();
        setCategories(response.data.categories);
      }catch(error){
        console.log(error);
        toast.error(error.response?.data?.message|| "Failed to load Categories");
      }
    };
    fetchCategories();
  },[]);
  const handleChange = (e)=>{
    const { name, value } = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]:value,
    }));
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.category_id || !formData.title.trim() || !formData.size || !formData.clothing_condition){
      toast.error("Please provide category, title, size and condition");
      return;
    }
    try{
      setLoading(true);
      const data = {
        category_id: Number(formData.category_id),
        title: formData.title,
        description: formData.description || null,
        brand: formData.brand || null,
        size: formData.size,
        clothing_condition: formData.clothing_condition,
        color: formData.color || null,
        gender: formData.gender || null,
        estimated_value: formData.estimated_value
          ? Number(formData.estimated_value)
          : null,
        city: formData.city || null,
        state: formData.state || null,
      }
      const response = await createClothing(data);
      toast.success(response.data.message);
      navigate("/my-listings");
    }catch(error){
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create clothing");
    }finally{
      setLoading(false);
    }
  };
  return (
    <DashboardLayout user={user} showNavbar={true}>
    <main className="min-h-[calc(100vh-86px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Clothing Listing
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Add Clothing
            </h1>
            <p className="mt-3 text-slate-500">
              Give your clothes a second life by adding them to the community.
            </p>
          </div>

          <button
            type="button"
            onClick={()=>navigate("/my-listings")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600"
          >
            <span className="text-lg">←</span>
            Back to Listings
          </button>
        </div>

        {/* Main Card */}
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          {/* Basic Information */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell the community about your clothing item.
              </p>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Clothing Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Classic denim jacket"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select 
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                  <option value="">Select a category</option>
                  {categories.map((category)=>(
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe the item, fit, material, and any other useful details..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
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
                Add details to help members find the right match.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Levi's"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Size
                </label>
                <select 
                  name="size"
                  onChange={handleChange}
                  value = {formData.size}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                  <option value="">Select size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Condition
                </label>
                <select 
                  name="clothing_condition"
                  value={formData.clothing_condition}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                  <option value="">Select condition</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g. Navy blue"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                  <option value="">Select gender</option>
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>
            </div>
          </section>

          <div className="my-10 border-t border-slate-100" />

          {/* Swap Value */}
          <section>
            <h2 className="text-lg font-bold text-slate-900">Swap Value</h2>
            <p className="mt-1 text-sm text-slate-500">
              Set an approximate value for your item.
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
                  name="estimated_value"
                  value={formData.estimated_value}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-3 text-sm outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                This helps other members understand the approximate value of
                your item.
              </p>
            </div>
          </section>

          <div className="my-10 border-t border-slate-100" />

          {/* Location */}
          <section>
            <h2 className="text-lg font-bold text-slate-900">Location</h2>
            <p className="mt-1 text-sm text-slate-500">
              Let members know where the exchange can take place.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </section>

          <div className="my-10 border-t border-slate-100" />

          {/* Image Upload UI */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Clothing Photos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add clear photos so members can see your item.
              </p>
            </div>

            <div className="group cursor-pointer rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm transition group-hover:scale-105">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-8h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="font-semibold text-slate-800">
                Upload clothing photos
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                PNG, JPG or WEBP
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Add up to 5 photos
              </p>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={()=>navigate("/dashboard")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30"
            >
              {loading?"Listing":"List Clothing"}
            </button>
          </div>
        </form>
      </div>
    </main>
    </DashboardLayout>
  );
}