import { useState, useEffect } from "react";
import { getAdminListings } from "../../services/adminServices";
import toast from "react-hot-toast";
import AdminLayout from "../../components/AdminLayout";
const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const fetchListings = async () => {
    try {
      setLoading(true);

      const response = await getAdminListings();

      setListings(response.data.listings || []);
    } catch (error) {
      console.log("ADMIN LISTINGS ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadListings = async () => {
      await fetchListings();
    };
    loadListings();
  }, []);
  const filteredListings = listings.filter((listing) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      listing.title?.toLowerCase().includes(searchText) ||
      listing.brand?.toLowerCase().includes(searchText) ||
      listing.owner_name?.toLowerCase().includes(searchText) ||
      listing.category?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" || listing.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-50 text-emerald-700";

      case "EXCHANGED":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };
  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        {/* Header */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Manage Listings
          </h1>

          <p className="mt-2 text-slate-500">
            Review and monitor clothing listings across ClothSwap.
          </p>
        </div>

        {/* Statistics */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Listings</p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {listings.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Available</p>

            <p className="mt-2 text-3xl font-black text-emerald-600">
              {listings.filter((item) => item.status === "AVAILABLE").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Exchanged</p>

            <p className="mt-2 text-3xl font-black text-blue-600">
              {listings.filter((item) => item.status === "EXCHANGED").length}
            </p>
          </div>
        </div>

        {/* Filters */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row">
          <input
            type="text"
            placeholder="Search title, brand, owner or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>

            <option value="AVAILABLE">Available</option>

            <option value="EXCHANGED">Exchanged</option>
          </select>
        </div>

        {/* Listings */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-slate-900">Clothing Listings</h2>

            <p className="mt-1 text-xs text-slate-400">
              {filteredListings.length} listings found
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">Loading listings...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No listings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Item
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Owner
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Details
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Value
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredListings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Item */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                            {listing.images?.[0] ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-2xl">
                                👕
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              {listing.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {listing.category || "Uncategorized"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {listing.owner_name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {listing.owner_email}
                        </p>
                      </td>

                      {/* Details */}

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-700">
                          {listing.brand || "Generic"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Size: {listing.size || "-"}
                          {" • "}
                          {listing.clothing_condition || "-"}
                        </p>
                      </td>

                      {/* Value */}

                      <td className="px-6 py-5">
                        <span className="font-bold text-slate-800">
                          ₹
                          {Number(
                            listing.estimated_value || 0,
                          ).toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                            listing.status,
                          )}`}
                        >
                          {listing.status}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="px-6 py-5">
                        <button
                          disabled
                          className="cursor-not-allowed rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminListings;