import {useState,useEffect} from "react";
import toast from "react-hot-toast";
import { getrecievedRequests,getSentRequests,acceptSwapRequest,rejectSwapRequest } from "../../services/swapServices";
import {
  ArrowLeftRight,
  Check,
  ChevronRight,
  Clock3,
  Inbox,
  MessageSquare,
  Send,
  Shirt,
  Sparkles,
  X,
} from "lucide-react";
import DashboardLayout from "../../components/DashbaordLayout";
const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ACCEPTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-600/20",
  COMPLETED: "bg-sky-50 text-sky-700 ring-sky-600/20",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const formatStatus = (status = "") =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

function ClothingDetails({ item, label }) {
  if (!item) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Shirt size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {label}
            </p>
            <h3 className="truncate text-sm font-bold text-slate-900">
              {item.name || item.title || "Clothing item"}
            </h3>
          </div>
        </div>

        {item.image && (
          <img
            src={item.image}
            alt={item.name || item.title || "Clothing item"}
            className="h-12 w-12 rounded-xl object-cover"
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-slate-50 p-2.5">
          <p className="mb-1 text-slate-400">Brand</p>
          <p className="truncate font-semibold text-slate-700">
            {item.brand || "Not Specified"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5">
          <p className="mb-1 text-slate-400">Size</p>
          <p className="truncate font-semibold text-slate-700">
            {item.size || "Not Specified"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5">
          <p className="mb-1 text-slate-400">Condition</p>
          <p className="truncate font-semibold text-slate-700">
            {item.condition || "Not Specified"}
          </p>
        </div>
      </div>
    </div>
  );
}

function RequestCard({
  request,
  isrecieved,
  onAccept,
  onReject,
  onViewDetails,
  actionLoading,
}) {
  const status = String(request.status || "PENDING").toUpperCase();
  const statusClass =
    statusStyles[status] || "bg-slate-100 text-slate-600 ring-slate-500/20";

  const personName = isrecieved
    ? request.sender_name || request.sender?.name || "ClothSwap member"
    : request.reciever_name || request.reciever?.name || "ClothSwap member";
 
  const personAvatar = isrecieved
    ? request.sender_avatar || request.sender?.avatar
    : request.reciever_avatar || request.reciever?.avatar;
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            {personAvatar ? (
              <img
                src={personAvatar}
                alt={personName}
                className="h-11 w-11 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-700">
                {personName.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-slate-400">
                {isrecieved ? "Swap request from" : "Swap request to"}
              </p>
              <h2 className="font-bold text-slate-900">{personName}</h2>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${statusClass}`}
          >
            {status === "PENDING" && <Clock3 size={14} />}
            {formatStatus(status)}
          </span>
        </div>

        {request.created_at || request.date ? (
          <p className="mt-4 text-xs text-slate-400">
            {request.created_at || request.date}
          </p>
        ) : null}
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <ClothingDetails
            item={{title: request.sender_item_title,brand: request.sender_item_brand,size: request.sender_item_size,condition: request.sender_item_condition,}}
            label={isrecieved ? "They offer" : "You offer"}
          />

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ArrowLeftRight size={18} />
          </div>

          <ClothingDetails
            item= {{title: request.reciever_item_title,brand: request.reciever_item_brand,size: request.reciever_item_size,condition: request.reciever_item_condition,}}
            label={isrecieved ? "They request" : "You request"}
          />
        </div>

        {request.message ? (
          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
            <MessageSquare
              size={18}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Message
              </p>
              <p className="text-sm leading-6 text-slate-600">
                {request.message}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => onViewDetails?.(request)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
          >
            View Details
            <ChevronRight size={16} />
          </button>

          {isrecieved && status === "PENDING" ? (
            <div className="flex gap-2">
              <button type="button" onClick={() => onReject(request)}
              disabled={actionLoading === request.id}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
              <X size={16} />
              Reject 
              </button>
              <button type="button" onClick={() => onAccept(request)}
              disabled={actionLoading === request.id}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
                <Check size={16} />
                Accept
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function SwapRequests() {
  const [recievedRequests, setrecievedRequests] = useState([]);
  const [sentRequests,setSentRequests] = useState([]);
  const [activeTab,setActiveTab] = useState("recieved");
  const [loading,setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRequest,setSelectedRequest] = useState(null);
  const requests =
    activeTab === "sent" ? sentRequests || [] : recievedRequests || [];
  const isrecieved = activeTab !== "sent";
  useEffect(()=>{
    const loadRequest = async()=>{
        try{
            setLoading(true);
            const [recievedResponse,sentResponse]=await Promise.all([
                getrecievedRequests(),
                getSentRequests(),
            ]);
            setrecievedRequests(recievedResponse.data.requests || []);
            setSentRequests(sentResponse.data.requests || []);
        }catch(error){
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to load swap requests");
        }finally{
            setLoading(false);
        }
    };
    loadRequest();
  },[]);
  const handleAccept = async (request) => {
    try {
      setActionLoading(request.id);
      const response = await acceptSwapRequest(
        request.id
      );
      toast.success(
        response.data.message ||
          "Swap request accepted"
      );
      // Update current request
      setrecievedRequests((prev) =>
        prev.map((item) =>
          item.id === request.id
            ? {
                ...item,
                status: "ACCEPTED",
              }
            : item
        )
      );
    } catch (error) {
      console.log("ACCEPT REQUEST ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to accept request"
      );
    } finally {
      setActionLoading(null);
    }
  };
  const handleReject = async(request)=>{
    try{
        setActionLoading(request.id);
        const response = await rejectSwapRequest(request.id);
        toast.success(response.data.message || "Swap request rejected");
        setrecievedRequests((prev)=>
         prev.map((item)=>
          item.id === request.id 
            ? {
                ...item,
                status:"REJECTED",
            } : item
         )
        );
    }catch(error){
        console.log("REJECT REQUEST ERROR:", error);
        toast.error(error.response?.data?.message ||  "Failed to reject request");
    }finally{
        setActionLoading(null);
    }
  };
  const handleViewDetails = (request)=>{
    setSelectedRequest(request);
  };
   if (loading) {
    return (
      <DashboardLayout>
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading swap requests...
              </p>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <Sparkles size={14} />
                ClothSwap
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Swap Requests
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Review your clothing exchange requests and find your next
                favorite piece.
              </p>
            </div>

            <div className="flex w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("recieved")}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                  activeTab !== "sent"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Inbox size={17} />
                recieved
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeTab !== "sent"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {recievedRequests?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("sent")}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                  activeTab === "sent"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Send size={17} />
                Sent
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeTab === "sent"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {sentRequests?.length || 0}
                </span>
              </button>
            </div>
          </div>

          {requests.length === 0 ? (
            <section className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                {isrecieved ? <Inbox size={30} /> : <Send size={30} />}
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                No {isrecieved ? "recieved" : "sent"} requests yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {isrecieved
                  ? "When someone sends you a clothing swap request, it will appear here."
                  : "Your outgoing clothing swap requests will appear here."}
              </p>
            </section>
          ) : (
            <section className="grid gap-5 xl:grid-cols-2">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  isrecieved={isrecieved}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                  actionLoading={actionLoading}
                />
              ))}
            </section>
          )}
        </div>
      </main>
      {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Swap Request
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    Request Details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Request #{selectedRequest.id}
                  </p>
                </div>
                <button type="button" onClick={() => setSelectedRequest(null)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6 p-6">
                {/* Status */}
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Status
                    </p>
                    <p className="mt-1 font-bold text-slate-900">
                      {formatStatus(selectedRequest.status)}
                    </p>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-xs font-bold ${
                    statusStyles[String(selectedRequest.status || "PENDING").toUpperCase()] || "bg-slate-100 text-slate-600"
                  }`}>
                    {formatStatus(selectedRequest.status)}
                  </span>
                </div>
                {/* Person */}
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isrecieved ? "Request From" : "Request To"}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-700">
                      {(
                        isrecieved? selectedRequest.sender_name: selectedRequest.reciever_name)?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {isrecieved? selectedRequest.sender_name || "ClothSwap member": selectedRequest.reciever_name || "ClothSwap member"}
                      </p>
                      <p className="text-sm text-slate-500">
                        ClothSwap member
                      </p>
                    </div>
                  </div>
                </div>
                {/* Swap Items */}
                <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Clothing Exchange
                </p>
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                {/* Sender item */}
                <div className="rounded-2xl border border-slate-200 p-5">
                <p className="mb-3 text-xs font-bold text-emerald-600">
                {isrecieved ? "THEY OFFER" : "YOU OFFER"}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Shirt size={22} />
                </div>

              <h3 className="mt-4 font-bold text-slate-900">
                {selectedRequest.sender_item_title || "Clothing item"}
              </h3>

              <div className="mt-3 space-y-1 text-sm text-slate-500">
                <p>
                  Brand:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedRequest.sender_item_brand || "Not specified"}
                  </span>
                </p>

                <p>
                  Size:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedRequest.sender_item_size || "Not specified"}
                  </span>
                </p>

                <p>
                  Condition:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedRequest.sender_item_condition || "Not specified"}
                  </span>
                </p>
              </div>
            </div>

            {/* Swap icon */}
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <ArrowLeftRight size={20} />
            </div>

            {/* Receiver item */}
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="mb-3 text-xs font-bold text-emerald-600">
                {isrecieved ? "THEY REQUEST" : "YOU REQUEST"}
              </p>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Shirt size={22} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                {selectedRequest.reciever_item_title || "Clothing item"}
              </h3>

              <div className="mt-3 space-y-1 text-sm text-slate-500">
                <p>
                  Brand:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedRequest.reciever_item_brand || "Not specified"}
                  </span>
                </p>

                <p>
                  Size:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedRequest.reciever_item_size || "Not specified"}
                  </span>
                </p>

                <p>
                  Condition:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedRequest.reciever_item_condition || "Not specified"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {selectedRequest.message && (
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex gap-3">
              <MessageSquare className="mt-0.5 text-emerald-600" size={19} />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Message
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedRequest.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Date */}
        {selectedRequest.created_at && (
          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">
              Requested:
            </span>{" "}
            {new Date(selectedRequest.created_at).toLocaleString()}
          </div>
        )}

        {/* Actions for received pending request */}
        {isrecieved &&
          String(selectedRequest.status).toUpperCase() === "PENDING" && (
            <div className="flex gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => {
                  setSelectedRequest(null);
                  handleReject(selectedRequest);
                }}
                disabled={actionLoading === selectedRequest.id}
                className="flex-1 rounded-xl border border-rose-200 px-4 py-3 font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRequest(null);
                  handleAccept(selectedRequest);
                }}
                disabled={actionLoading === selectedRequest.id}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                Accept Swap
              </button>
            </div>
          )}

        {/* Close */}
        <button
          type="button"
          onClick={() => setSelectedRequest(null)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>)}
    </DashboardLayout>
  );
}