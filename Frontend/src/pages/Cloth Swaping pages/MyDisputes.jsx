import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashbaordLayout";
import { getMyDisputes } from "../../services/disputeServices";

const MyDisputes = () => {
  const navigate = useNavigate();

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("ALL");
  useEffect(() => {
    let cancelled = false;

    const fetchInitialDisputes = async () => {
      try {
        const response = await getMyDisputes();

        if (cancelled) return;

        setDisputes(response.data.disputes || []);
      } catch (error) {
        if (cancelled) return;

        console.error("GET MY DISPUTES ERROR:", error);

        toast.error(error.response?.data?.message || "Failed to load disputes");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialDisputes();

    return () => {
      cancelled = true;
    };
  }, []);
  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const response = await getMyDisputes();

      setDisputes(response.data.disputes || []);

      toast.success("Disputes refreshed");
    } catch (error) {
      console.error("REFRESH DISPUTES ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to refresh disputes",
      );
    } finally {
      setRefreshing(false);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "OPEN":
        return <AlertTriangle size={15} />;

      case "UNDER_REVIEW":
        return <Clock size={15} />;

      case "RESOLVED":
        return <CheckCircle size={15} />;

      case "CLOSED":
        return <XCircle size={15} />;

      default:
        return null;
    }
  };

  const filteredDisputes =
    filter === "ALL"
      ? disputes
      : disputes.filter((dispute) => dispute.status === filter);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <DashboardLayout user={user} showNavbar={true}>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Disputes</h1>

              <p className="text-slate-500 mt-1">
                View and respond to your swap disputes.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-wrap gap-2 mb-6">
            {[
              ["ALL", "All"],
              ["OPEN", "Open"],
              ["UNDER_REVIEW", "Under Review"],
              ["RESOLVED", "Resolved"],
              ["CLOSED", "Closed"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === value
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <RefreshCw
                className="animate-spin mx-auto text-slate-500"
                size={28}
              />

              <p className="text-slate-500 mt-3">Loading disputes...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredDisputes.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <MessageSquare size={42} className="mx-auto text-slate-300" />

              <h2 className="text-lg font-semibold text-slate-800 mt-4">
                No disputes found
              </h2>

              <p className="text-slate-500 mt-1">
                You don't have any disputes in this category.
              </p>
            </div>
          )}

          {/* Disputes */}
          {!loading && filteredDisputes.length > 0 && (
            <div className="space-y-4">
              {filteredDisputes.map((dispute) => {
                const currentUser = JSON.parse(
                  localStorage.getItem("user") || "{}",
                );

                const isRaisedByMe =
                  Number(dispute.raised_by) === Number(currentUser.id);

                const otherUser = isRaisedByMe
                  ? dispute.against_user_name
                  : dispute.raised_by_name;

                return (
                  <div
                    key={dispute.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-bold text-slate-900">
                            {dispute.subject}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(dispute.status)}`}
                          >
                            {getStatusIcon(dispute.status)}
                            {dispute.status.replace("_", " ")}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-2">
                          Dispute #{dispute.id}
                          {" • "}
                          Swap #{dispute.swap_request_id}
                        </p>

                        <p className="text-sm text-slate-600 mt-3">
                          Against:{" "}
                          <span className="font-medium text-slate-800">
                            {otherUser || "Other Swapper"}
                          </span>
                        </p>

                        {dispute.latest_message && (
                          <div className="mt-4 bg-slate-50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 mb-1">
                              Latest message
                            </p>

                            <p className="text-sm text-slate-700 line-clamp-2">
                              {dispute.latest_message}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/disputes/${dispute.id}`)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                      >
                        <MessageSquare size={17} />
                        View Dispute
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyDisputes;
