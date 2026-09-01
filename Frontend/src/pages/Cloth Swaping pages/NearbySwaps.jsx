import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNearbyListings } from "../../services/nearbyServices";
import {
  MapPin,
  Navigation,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ChevronDown,
  Shirt,
  Compass,
} from "lucide-react";
import DashboardLayout from "../../components/DashbaordLayout";
const FILTERS = [
  {
    label: "Category",
    options: ["All", "Shirts", "Jeans", "Dresses", "Jackets", "Hoodies"],
  },
  { label: "Size", options: ["All", "XS", "S", "M", "L", "XL"] },
  {
    label: "Condition",
    options: ["All", "Like New", "Excellent", "Good", "Gently Used"],
  },
  {
    label: "Price Range",
    options: ["Any", "Under ₹1,000", "₹1,000 – ₹2,000", "₹2,000+"],
  },
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function SelectField({ label, options }) {
  return (
    <label className="block w-full">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="relative">
        <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}
function LocationSearch({
  city,
  state,
  setCity,
  setState,
  onSearch,
  loading,
  locating,
  onUseMyLocation,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="max-w-xl">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Find clothes near you
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Search for available clothing items in your city.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"
      >
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="relative">
          <Compass className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter state"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
        >
          <MapPin className="h-4 w-4" />

          {loading ? "Searching..." : "Find Nearby Clothes"}
        </button>
      </form>

      <button
        type="button"
        onClick={onUseMyLocation}
        disabled={locating}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        <Navigation className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
        {locating ? "Detecting location..." : "Use my location"}
      </button>
    </section>
  );
}

function FilterBar() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-slate-700">
        <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
        <h3 className="text-sm font-semibold">Refine results</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FILTERS.map((f) => (
          <SelectField key={f.label} {...f} />
        ))}
      </div>
    </section>
  );
}

function ListingCard({ item }) {
  const navigate = useNavigate();
  const isAvailable = String(item.status || "").toUpperCase() === "AVAILABLE";
  const condition = String(item.clothing_condition || "Not Specified")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative m-3 overflow-hidden rounded-2xl bg-slate-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-4/3 w-full items-center justify-center bg-emerald-50 text-emerald-400">
            <Shirt className="h-16 w-16" />
          </div>
        )}

        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
            {item.category_name || "Clothing"}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
              isAvailable
                ? "bg-emerald-600/90 text-white"
                : "bg-slate-800/80 text-slate-100"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>

        <p className="text-sm text-slate-500">
          {item.brand || "Brand not specified"}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            Size: {item.size || "N/A"}
          </span>

          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {condition}
          </span>
        </div>

        <p className="mt-4 text-lg font-bold text-slate-900">
          ₹{Number(item.estimated_value || 0).toLocaleString("en-IN")}
          <span className="ml-1.5 text-xs font-medium text-slate-400">
            est. swap value
          </span>
        </p>

        <div className="mt-2 space-y-1">
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />

            <span className="truncate">
              {item.city}, {item.state}
            </span>
          </p>

          {item.distance_km !== undefined && (
            <p className="text-xs font-semibold text-emerald-600">
              {Number(item.distance_km).toFixed(1)} km away
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
              {(item.owner_name || "U").charAt(0).toUpperCase()}
            </span>

            <span className="truncate text-sm font-medium text-slate-700">
              {item.owner_name || "ClothSwap member"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/clothing/${item.id}`)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors group-hover:text-emerald-700"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function LoadingCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="aspect-4/3 w-full rounded-2xl bg-slate-200" />
      <div className="space-y-3 px-2 pb-3 pt-4">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-lg bg-slate-200" />
          <div className="h-6 w-24 rounded-lg bg-slate-200" />
        </div>
        <div className="h-5 w-1/4 rounded bg-slate-200" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-8 w-24 rounded-full bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

export function EmptyState({ onSearchAgain }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Search className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        No nearby clothes found
      </h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Try searching another city or expanding your location to discover more
        clothing swaps.
      </p>
      <button
        type="button"
        onClick={onSearchAgain}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
      >
        <MapPin className="h-4 w-4" />
        Search Again
      </button>
    </div>
  );
}
export default function NearbySwaps() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const searchNearbyListings = async (
    searchCity = city,
    searchState = state,
    latitude = null,
    longitude = null,
  ) => {
    if (!searchCity.trim()) {
      setError("Please enter a city.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getNearbyListings(
        searchCity.trim(),
        searchState.trim(),
        latitude,
        longitude,
      );

      setListings(response.data.listings || []);
      setSearched(true);
    } catch (error) {
      console.error("GET NEARBY LISTINGS ERROR:", error);

      setListings([]);

      setError(
        error.response?.data?.message || "Unable to load nearby listings.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log("USER LOCATION:", {
            latitude,
            longitude,
          });

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );

          if (!response.ok) {
            throw new Error("Unable to detect your city.");
          }

          const location = await response.json();

          console.log("DETECTED LOCATION:", location);

          const detectedCity =
            location.city || location.locality || location.localityName || "";

          const detectedState = location.principalSubdivision || "";

          if (!detectedCity) {
            throw new Error(
              "Could not determine your city from your location.",
            );
          }
          setCity(detectedCity);
          setState(detectedState);

          // Search using the newly detected values
          await searchNearbyListings(
            detectedCity,
            detectedState,
            latitude,
            longitude,
          );
        } catch (error) {
          console.error("LOCATION DETECTION ERROR:", error);

          setError(error.message || "Unable to determine your location.");
        } finally {
          setLocating(false);
        }
      },

      (error) => {
        console.error("BROWSER LOCATION ERROR:", error);

        setLocating(false);

        if (error.code === 1) {
          setError(
            "Location permission was denied. Please allow location access in your browser.",
          );
        } else if (error.code === 2) {
          setError("Your location could not be determined. Please try again.");
        } else if (error.code === 3) {
          setError("Location request timed out. Please try again.");
        } else {
          setError("Unable to get your current location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };
  return (
    <DashboardLayout user={user} showNavbar={true}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* HEADER */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <MapPin className="h-3.5 w-3.5" />
              ClothSwap • Location Based
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Nearby Swaps
            </h1>

            <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
              Discover clothing items available for exchange near you.
            </p>
          </div>

          <div className="hidden shrink-0 md:block">
            <div className="relative flex h-32 w-52 items-center justify-center overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/70">
              <div className="absolute inset-0 opacity-60 bg-[linear-gradient(to_right,rgb(209_250_229)_1px,transparent_1px),linear-gradient(to_bottom,rgb(209_250_229)_1px,transparent_1px)]" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
                <Navigation className="h-6 w-6" />
              </div>

              <span className="absolute bottom-3 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                Nearby
              </span>
            </div>
          </div>
        </header>

        {/* SEARCH */}
        <div className="mt-8">
          <LocationSearch
            city={city}
            state={state}
            setCity={setCity}
            setState={setState}
            onSearch={searchNearbyListings}
            loading={loading}
            locating={locating}
            onUseMyLocation={handleUseMyLocation}
          />
        </div>

        {/* FILTERS */}
        <div className="mt-6">
          <FilterBar />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* RESULTS */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Clothing Available Near You
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Find something you like and start a swap.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">
                {listings.length} items found
              </span>

              <div className="relative">
                <select
                  aria-label="Sort by"
                  className="appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm"
                >
                  <option>Sort by: Newest</option>
                  <option>Sort by: Lowest Value</option>
                  <option>Sort by: Highest Value</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="mt-6">
              <LoadingGrid count={6} />
            </div>
          )}

          {/* EMPTY BEFORE SEARCH */}
          {!loading && !searched && !error && (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <MapPin className="mx-auto h-10 w-10 text-emerald-500" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Search for nearby clothes
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Enter your city above to discover available clothing items from
                other ClothSwap members nearby.
              </p>
            </div>
          )}

          {/* EMPTY AFTER SEARCH */}
          {!loading && searched && listings.length === 0 && !error && (
            <div className="mt-6">
              <EmptyState
                onSearchAgain={() => {
                  setSearched(false);
                  setListings([]);
                }}
              />
            </div>
          )}

          {/* REAL LISTINGS */}
          {!loading && listings.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* BOTTOM */}
        <section className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Can't find what you're looking for?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try browsing all available clothing listings.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white sm:w-auto"
          >
            Browse All Clothes
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}
