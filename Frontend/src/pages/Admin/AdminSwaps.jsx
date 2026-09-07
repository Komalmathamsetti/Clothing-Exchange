import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/AdminLayout";
import { getAdminSwaps } from "../../services/adminServices";

const AdminSwaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchSwaps = async () => {
    try {
      setLoading(true);

      const response = await getAdminSwaps();

      setSwaps(response.data.swaps || []);
    } catch (error) {
      console.log("ADMIN SWAPS ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load swaps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSwaps = async()=>{
       await fetchSwaps();
    }
    loadSwaps();
  }, []);

  const filteredSwaps =
    statusFilter === "ALL"
      ? swaps
      : swaps.filter((swap) => swap.status === statusFilter);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-50 text-blue-700";

      case "ACCEPTED":
        return "bg-emerald-50 text-emerald-700";

      case "REJECTED":
        return "bg-red-50 text-red-700";

      case "CANCELLED":
        return "bg-slate-100 text-slate-600";

      case "COMPLETED":
        return "bg-purple-50 text-purple-700";

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
            Manage Swaps
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor all swap activity across the ClothSwap platform.
          </p>
        </div>

        {/* Statistics */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {swaps.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>

            <p className="mt-2 text-3xl font-black text-blue-600">
              {swaps.filter((swap) => swap.status === "PENDING").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Accepted</p>

            <p className="mt-2 text-3xl font-black text-emerald-600">
              {swaps.filter((swap) => swap.status === "ACCEPTED").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Rejected</p>

            <p className="mt-2 text-3xl font-black text-red-500">
              {swaps.filter((swap) => swap.status === "REJECTED").length}
            </p>
          </div>
        </div>

        {/* Filter */}

        <div className="mb-6 flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Swaps</option>

            <option value="PENDING">Pending</option>

            <option value="ACCEPTED">Accepted</option>

            <option value="REJECTED">Rejected</option>

            <option value="CANCELLED">Cancelled</option>

            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Swap table */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-slate-900">Swap Requests</h2>

            <p className="mt-1 text-xs text-slate-400">
              {filteredSwaps.length} records
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading swap activity...
              </p>
            </div>
          ) : filteredSwaps.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No swap requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Swap
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Sender
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Receiver
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Exchange
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSwaps.map((swap) => (
                    <tr key={swap.id} className="transition hover:bg-slate-50">
                      {/* ID */}

                      <td className="px-6 py-5">
                        <span className="font-bold text-slate-800">
                          #{swap.id}
                        </span>
                      </td>

                      {/* Sender */}

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {swap.sender_name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {swap.sender_email}
                        </p>
                      </td>

                      {/* Receiver */}

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {swap.receiver_name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {swap.receiver_email}
                        </p>
                      </td>

                      {/* Exchange */}

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {swap.sender_item_title || "-"}
                        </p>

                        <p className="my-1 text-xs font-bold text-emerald-500">
                          ↕
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                          {swap.receiver_item_title || "-"}
                        </p>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                            swap.status,
                          )}`}
                        >
                          {swap.status}
                        </span>
                      </td>

                      {/* Date */}

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600">
                          {new Date(swap.created_at).toLocaleDateString()}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(swap.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
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

export default AdminSwaps;
