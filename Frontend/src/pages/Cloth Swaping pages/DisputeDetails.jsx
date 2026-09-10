import { useEffect, useState,useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, RefreshCw, User, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashbaordLayout";

import {
  getDisputeById,
  addDisputeMessage,
} from "../../services/disputeServices";

const DisputeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dispute, setDispute] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDispute = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getDisputeById(id);

      setDispute(response.data.dispute);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("GET DISPUTE DETAILS ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load dispute");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [id]);

  useEffect(() => {
    const loadDispute = async()=>{
        await fetchDispute();
    }
    loadDispute();
  }, [fetchDispute]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      setSending(true);

      const response = await addDisputeMessage(id, message.trim());

      const newMessage = response.data.disputeMessage;

      setMessages((previous) => [...previous, newMessage]);

      setMessage("");

      toast.success("Reply sent");

      // Refresh dispute to update status
      const refreshed = await getDisputeById(id);

      setDispute(refreshed.data.dispute);
    } catch (error) {
      console.error("SEND DISPUTE MESSAGE ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to send reply");
    } finally {
      setSending(false);
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
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
          <RefreshCw size={30} className="animate-spin text-slate-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!dispute) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold">Dispute not found</h2>

            <button
              onClick={() => navigate("/disputes")}
              className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-xl"
            >
              Back to Disputes
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isClosed = dispute.status === "CLOSED";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Top */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/disputes")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={18} />
              My Disputes
            </button>

            <button
              onClick={() => fetchDispute(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-xl"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Dispute information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  Dispute #{dispute.id}
                  {" • "}
                  Swap #{dispute.swap_request_id}
                </p>

                <h1 className="text-2xl font-bold text-slate-900 mt-1">
                  {dispute.subject}
                </h1>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(dispute.status)}`}
              >
                {dispute.status.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">Raised By</p>

                <p className="font-semibold text-slate-800 mt-1">
                  {dispute.raised_by_name}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">Against</p>

                <p className="font-semibold text-slate-800 mt-1">
                  {dispute.against_user_name}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Original Complaint
              </p>

              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
                {dispute.description}
              </div>
            </div>
          </div>

          {/* Conversation */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center gap-2">
              <MessageIcon />

              <div>
                <h2 className="font-bold text-slate-900">
                  Dispute Conversation
                </h2>

                <p className="text-xs text-slate-500">
                  All participants can see these messages.
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-137.5 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-center text-slate-500 py-10">
                  No messages yet.
                </p>
              )}

              {messages.map((item) => {
                const isMine =
                  Number(item.sender_id) === Number(currentUser.id);

                const isAdmin = item.sender_role === "ADMIN";

                if (isAdmin) {
                  return (
                    <div key={item.id} className="flex justify-center">
                      <div className="max-w-2xl w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck size={17} className="text-yellow-700" />

                          <span className="font-semibold text-yellow-800">
                            Admin
                          </span>

                          <span className="text-xs text-yellow-600">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
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
                      <div className="flex items-center gap-2 mb-2">
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

                      <p className="text-sm whitespace-pre-wrap">
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
                  placeholder="Write your reply..."
                  className="w-full border border-slate-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
                />

                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold disabled:opacity-50"
                  >
                    <Send size={17} />

                    {sending ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="border-t border-slate-200 p-5 text-center bg-slate-50">
                <p className="text-sm text-slate-500">
                  This dispute has been closed. No further replies can be sent.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Small component to avoid another lucide naming conflict
const MessageIcon = () => (
  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
    <Send size={17} className="text-slate-700" />
  </div>
);

export default DisputeDetails;
