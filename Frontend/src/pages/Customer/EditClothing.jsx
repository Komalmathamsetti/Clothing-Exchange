import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getClothingById,
  getCategories,
  updateClothing,
} from "../../services/clothingServices";
import DashboardLayout from "../../components/DashbaordLayout";
export default function EditClothing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clothingResponse, categoriesResponse] = await Promise.all([
          getClothingById(id),
          getCategories(),
        ]);
        const clothing = clothingResponse.data.clothing;
        setExistingImages(clothing.images || []);
        setCategories(categoriesResponse.data.categories || []);
        setFormData({
          category_id: clothing.category_id || "",
          title: clothing.title || "",
          description: clothing.description || "",
          brand: clothing.brand || "",
          size: clothing.size || "",
          clothing_condition: clothing.clothing_condition || "",
          color: clothing.color || "",
          gender: clothing.gender || "",
          estimated_value: clothing.estimated_value || "",
          city: clothing.city || "",
          state: clothing.state || "",
        });
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to load clothing");
        navigate("/my-listings");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type),
    );

    if (invalidFile) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    const totalImages =
      existingImages.length + newImages.length + selectedFiles.length;

    if (totalImages > 5) {
      toast.error("You can have a maximum of 5 images");
      return;
    }

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));

    setNewImages((prev) => [...prev, ...selectedFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));

    setImagePreviews((prev) => {
      const previewToRemove = prev[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }

      return prev.filter((_, i) => i !== index);
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.category_id ||
      !formData.title.trim() ||
      !formData.size ||
      !formData.clothing_condition
    ) {
      toast.error("Please provide category, title, size and condition");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("category_id", Number(formData.category_id));

      data.append("title", formData.title);
      data.append("description", formData.description || "");
      data.append("brand", formData.brand || "");
      data.append("size", formData.size);
      data.append("clothing_condition", formData.clothing_condition);
      data.append("color", formData.color || "");
      data.append("gender", formData.gender || "");

      data.append(
        "estimated_value",
        formData.estimated_value ? Number(formData.estimated_value) : "",
      );

      data.append("city", formData.city || "");
      data.append("state", formData.state || "");

      newImages.forEach((image) => {
        data.append("images", image);
      });

      const response = await updateClothing(id, data);

      toast.success(response.data.message || "Clothing updated successfully");

      navigate("/my-listings");
    } catch (error) {
      console.log("UPDATE CLOTHING ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to update clothing");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <DashboardLayout user={user} showNavbar={false}>
        <main className="min-h-[calc(100vh-86px)] bg-slate-50">
          <div className="flex min-h-125 items-center justify-center">
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
    <DashboardLayout user={user} showNavbar={false}>
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
              onClick={() => navigate("/my-listings")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600"
            >
              <span className="text-lg">←</span>
              Back to Listings
            </button>
          </div>

          {/* Main Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8"
          >
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
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
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
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </section>
            {/* Images */}
            <section>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Clothing Images
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the photos of your clothing item. You can upload up to
                  5 images.
                </p>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    Current Images
                  </p>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                    {existingImages.map((image, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={image}
                          alt={`${formData.title} ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {imagePreviews.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    New Images
                  </p>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={preview}
                        className="relative overflow-hidden rounded-xl border border-emerald-200 bg-slate-100"
                      >
                        <img
                          src={preview}
                          alt={`New image ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload */}
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30">
                <span className="text-3xl">📷</span>

                <span className="mt-3 text-sm font-semibold text-slate-700">
                  Choose new images
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  JPG, PNG or WEBP • Maximum 5 images
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
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
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Size
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">Select Size</option>
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">Selection condition</option>
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
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">Select Gender</option>
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
                    name="estimated_value"
                    value={formData.estimated_value}
                    onChange={handleChange}
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
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </section>

            <div className="my-10 border-t border-slate-100" />
            {/* Actions */}
            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/my-listings")}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </DashboardLayout>
  );
}
