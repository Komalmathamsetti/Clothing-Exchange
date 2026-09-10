import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/AdminLayout";

import {
  getAdminDisputes,
  updateDisputeStatus,
} from "../../services/disputeServices";

const AdminDisputes = () => {
  const navigate = useNavigate();

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchDisputes = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getAdminDisputes();

      setDisputes(response.data.disputes || []);
    } catch (error) {
      console.error("ADMIN DISPUTES ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load disputes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadDisputes = async()=>{
        await fetchDisputes();
    }
    loadDisputes();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-700";

      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-700";

      case "RESOLVED":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-slate-200 text-slate-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };
  const filteredDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      const matchesStatus =
        statusFilter === "ALL" || dispute.status === statusFilter;

      const searchText = search.toLowerCase().trim();

      if (!searchText) {
        return matchesStatus;
      }

      const matchesSearch =
        String(dispute.id).includes(searchText) ||
        String(dispute.swap_request_id).includes(searchText) ||
        dispute.subject?.toLowerCase().includes(searchText) ||
        dispute.raised_by_name?.toLowerCase().includes(searchText) ||
        dispute.against_user_name?.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [disputes, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: disputes.length,

      open: disputes.filter((d) => d.status === "OPEN").length,

      review: disputes.filter((d) => d.status === "UNDER_REVIEW").length,

      resolved: disputes.filter((d) => d.status === "RESOLVED").length,

      closed: disputes.filter((d) => d.status === "CLOSED").length,
    };
  }, [disputes]);

  const handleStatusChange = async (disputeId, newStatus) => {
    try {
      await updateDisputeStatus(disputeId, newStatus);

      setDisputes((previous) =>
        previous.map((dispute) =>
          dispute.id === disputeId
            ? {
                ...dispute,
                status: newStatus,
              }
            : dispute,
        ),
      );

      toast.success("Dispute status updated");
    } catch (error) {
      console.error("UPDATE DISPUTE STATUS ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Disputes</h1>

              <p className="text-slate-500 mt-1">
                Review complaints and communicate with swappers.
              </p>
            </div>

            <button
              onClick={() => fetchDisputes(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard title="Total" value={counts.total} />

            <StatCard title="Open" value={counts.open} />

            <StatCard title="Under Review" value={counts.review} />

            <StatCard title="Resolved" value={counts.resolved} />

            <StatCard title="Closed" value={counts.closed} />
          </div>

          {/* Search/filter */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by dispute, swap, subject or user..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl bg-white"
              >
                <option value="ALL">All Statuses</option>

                <option value="OPEN">Open</option>

                <option value="UNDER_REVIEW">Under Review</option>

                <option value="RESOLVED">Resolved</option>

                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw
                  size={28}
                  className="animate-spin mx-auto text-slate-500"
                />

                <p className="text-slate-500 mt-3">Loading disputes...</p>
              </div>
            ) : filteredDisputes.length === 0 ? (
              <div className="p-12 text-center">
                <AlertTriangle size={40} className="mx-auto text-slate-300" />

                <p className="text-slate-500 mt-3">No disputes found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Dispute
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Raised By
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Against
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Status
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Messages
                      </th>

                      <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredDisputes.map((dispute) => (
                      <tr key={dispute.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {dispute.subject}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Dispute #{dispute.id}
                            {" • "}
                            Swap #{dispute.swap_request_id}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {dispute.raised_by_name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {dispute.raised_by_email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {dispute.against_user_name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {dispute.against_user_email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={dispute.status}
                            onChange={(e) =>
                              handleStatusChange(dispute.id, e.target.value)
                            }
                            className={`px-3 py-2 rounded-lg text-xs font-semibold border-0 ${getStatusStyle(
                              dispute.status,
                            )}`}
                          >
                            <option value="OPEN">OPEN</option>

                            <option value="UNDER_REVIEW">UNDER REVIEW</option>

                            <option value="RESOLVED">RESOLVED</option>

                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-700">
                            {dispute.message_count || 0}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(`/admin/disputes/${dispute.id}`)
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
                          >
                            <Eye size={16} />
                            View
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
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5">
    <p className="text-sm text-slate-500">{title}</p>

    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export default AdminDisputes;
