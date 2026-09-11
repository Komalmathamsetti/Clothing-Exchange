import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, RefreshCw, User, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/AdminLayout";

import {
  getDisputeById,
  addDisputeMessage,
  updateDisputeStatus,
} from "../../services/disputeServices";

const AdminDisputeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dispute, setDispute] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // Initial loading
  useEffect(() => {
    let cancelled = false;

    const loadDispute = async () => {
      try {
        const response = await getDisputeById(id);

        if (cancelled) return;

        setDispute(response.data.dispute);
        setMessages(response.data.messages || []);
      } catch (error) {
        if (cancelled) return;

        console.error("ADMIN DISPUTE DETAILS ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load dispute"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDispute();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Manual refresh
  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const response = await getDisputeById(id);

      setDispute(response.data.dispute);
      setMessages(response.data.messages || []);

      toast.success("Dispute refreshed");
    } catch (error) {
      console.error("REFRESH ADMIN DISPUTE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to refresh dispute"
      );
    } finally {
      setRefreshing(false);
    }
  };

  // Send admin reply
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      setSending(true);

      const response = await addDisputeMessage(
        id,
        message.trim()
      );

      setMessages((previous) => [
        ...previous,
        response.data.disputeMessage,
      ]);

      setMessage("");

      toast.success("Reply sent");

      const refreshed = await getDisputeById(id);

      setDispute(refreshed.data.dispute);
      setMessages(refreshed.data.messages || []);
    } catch (error) {
      console.error("ADMIN SEND MESSAGE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to send reply"
      );
    } finally {
      setSending(false);
    }
  };
  const handleStatusChange = async (newStatus) => {
    try {
      await updateDisputeStatus(id, newStatus);

      setDispute((previous) => ({
        ...previous,
        status: newStatus,
      }));

      toast.success("Dispute status updated");
    } catch (error) {
      console.error("ADMIN STATUS ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to update status");
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
          <div className="text-center">
            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-slate-500"
            />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading dispute...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!dispute) {
    return (
      <AdminLayout>
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
          <div className="text-center">
            <p className="text-slate-500">Dispute not found.</p>

            <button
              type="button"
              onClick={() => navigate("/admin/disputes")}
              className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to Disputes
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const isClosed = dispute.status === "CLOSED";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/disputes")}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={18} />
              Back to Disputes
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Dispute Information */}
          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Dispute #{dispute.id}
                  {" • "}
                  Swap #{dispute.swap_request_id}
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                  {dispute.subject}
                </h1>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                  dispute.status,
                )}`}
              >
                {dispute.status.replace("_", " ")}
              </span>
            </div>

            {/* Users */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Raised By</p>

                <p className="mt-1 font-semibold text-slate-800">
                  {dispute.raised_by_name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {dispute.raised_by_email}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Against</p>

                <p className="mt-1 font-semibold text-slate-800">
                  {dispute.against_user_name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {dispute.against_user_email}
                </p>
              </div>
            </div>

            {/* Original complaint */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Original Complaint
              </p>

              <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {dispute.description}
              </div>
            </div>

            {/* Admin status control */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Manage Status
              </label>

              <select
                value={dispute.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="OPEN">OPEN</option>

                <option value="UNDER_REVIEW">UNDER REVIEW</option>

                <option value="RESOLVED">RESOLVED</option>

                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </section>

          {/* Conversation */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-200 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Dispute Conversation
                </h2>

                <p className="text-xs text-slate-500">
                  All participants can see these messages.
                </p>
              </div>
            </div>

            <div className="max-h-137.5 space-y-4 overflow-y-auto p-5">
              {messages.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">
                  No messages yet.
                </p>
              )}

              {messages.map((item) => {
                const isAdmin = item.sender_role === "ADMIN";

                const isMine =
                  Number(item.sender_id) === Number(currentUser.id);

                if (isAdmin) {
                  return (
                    <div key={item.id} className="flex justify-center">
                      <div className="w-full max-w-2xl rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <ShieldCheck size={16} className="text-yellow-700" />

                          <span className="text-sm font-semibold text-yellow-800">
                            Admin
                          </span>

                          <span className="text-xs text-yellow-600">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>

                        <p className="whitespace-pre-wrap text-sm text-slate-700">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 ${
                        isMine
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <User size={15} />

                        <span className="text-xs font-semibold">
                          {isMine ? "You" : item.sender_name}
                        </span>

                        <span
                          className={`text-[10px] ${
                            isMine ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>

                      <p className="whitespace-pre-wrap text-sm">
                        {item.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply */}
            {!isClosed ? (
              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-200 p-5"
              >
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Write an admin reply..."
                  className="w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={17} />

                    {sending ? "Sending..." : "Send Admin Reply"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="border-t border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500">
                  This dispute is closed. No further replies can be sent.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDisputeDetails;
