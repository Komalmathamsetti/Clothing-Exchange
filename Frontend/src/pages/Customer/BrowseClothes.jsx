import { Heart, Search, MapPin, Shirt } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllClothings, getCategories} from "../../services/clothingServices";
import DashboardLayout from "../../components/DashbaordLayout";

export default function BrowseClothes() {
  const navigate = useNavigate();
  const [user] = useState(()=>{
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser):null;
  });
  const [clothes,setClothes] = useState([]);
  const [categories,setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const loadData = async()=>{
        try{
            setLoading(true);
            const [clothingResponse,categoryResponse] = await Promise.all([
                getAllClothings(),
                getCategories(),
            ]);
            setClothes(clothingResponse.data.clothing || []);
            setCategories(categoryResponse.data.categories || []);
        }catch(error){
            console.log(error);
            toast.error(error.response?.data?.message ||"Failed to load clothes");
        }finally{
            setLoading(false);
        }
    };
    loadData();
  },[]);
  const filteredItems = clothes.filter((item) =>{
    const searchText = search.toLowerCase();
    const matchesSearch = !search || item.title ?.toLowerCase().includes(searchText) || item.brand?.toLowerCase().includes(searchText) || item.category ?.toLowerCase().includes(searchText);
    const matchesCategory = !category || String(item.category_id) === String(category);
    const matchesSize = !size || item.size === size;
    const matchesCondition = !condition || item.clothing_condition === condition;
    const matchesGender = !gender || item.gender === gender;
    const itemLocation =`${item.city || ""} ${item.state || ""}`.toLowerCase();
    const matchesLocation = !location || itemLocation.includes(location.toLowerCase());
    return(
        matchesSearch &&
        matchesCategory &&
        matchesSize &&
        matchesCondition &&
        matchesGender &&
        matchesLocation
    );
  });
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSize("");
    setCondition("");
    setGender("");
    setLocation("");
  };

  return (
    <DashboardLayout user={user} showNavbar={true}>
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
                Explore Clothing
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                Browse Clothes
              </h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Discover pre-loved fashion from the community and find something
                perfect for your next swap.
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              {filteredItems.length}{" "}{filteredItems.length === 1 ? "item" : "items"} available
            </span>
          </div>

          <div className="mb-4 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-emerald-500">
            <Search className="mr-3 h-5 w-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clothes, brands, or styles..."
              className="h-14 w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
            <select 
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select 
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="">All Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="">All Conditions</option>
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
            </select>
            <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="">All Gender</option>
              <option value="MEN">Men</option>
              <option value="WOMEN">Women</option>
              <option value="UNISEX">Unisex</option>
            </select>
            <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-600 outline-none focus:border-emerald-500"/>
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Clear Filters
            </button>
          </div>
           {loading ? (
            <div className="flex min-h-100 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading clothes...
                </p>
              </div>
            </div>):filteredItems.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
              <Shirt className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900">
                No clothes found
              </h2>
              <p className="mt-2 text-slate-500">
                Try changing your search or filters to discover more items.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-64 items-center justify-center bg-emerald-50 text-6xl">👕
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold tracking-wide text-white">
                      AVAILABLE
                    </span>

                    <button className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-600 shadow hover:text-emerald-600">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-5">
                    <h2 className="font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{item.brand}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[item.size, item.clothing_condition, item.category].filter(Boolean).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="mt-5 text-lg font-bold text-emerald-600">
                      {item.estimated_value? `₹${item.estimated_value}`: "Value not specified"}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.city || "Location unavailable"}
                      {item.state && `, ${item.state}`}
                    </p>

                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                        {item.owner_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-slate-600">{item.owner}</span>
                      <span className="ml-auto text-slate-500">
                        {item.owner_rating? `${item.owner_rating} ★`: "New"} 
                      </span>
                    </div>

                    <button type="button" onClick={()=>navigate(`/clothing/${item.id}`)} className="mt-5 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 cursor-pointer">
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}