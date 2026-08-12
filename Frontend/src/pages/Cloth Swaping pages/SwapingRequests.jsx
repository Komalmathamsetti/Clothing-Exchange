import {useState,useEffect} from "react";
import toast from "react-hot-toast";
import { getReceivedRequests,getSentRequests,acceptSwapRequest,rejectSwapRequest } from "../../services/swapServices";
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
  isReceived,
  onAccept,
  onReject,
  onViewDetails,
  actionLoading,
}) {
  const status = String(request.status || "PENDING").toUpperCase();
  const statusClass =
    statusStyles[status] || "bg-slate-100 text-slate-600 ring-slate-500/20";

  const personName = isReceived
    ? request.sender_name || request.sender?.name || "ClothSwap member"
    : request.receiver_name || request.receiver?.name || "ClothSwap member";
 
  const personAvatar = isReceived
    ? request.sender_avatar || request.sender?.avatar
    : request.receiver_avatar || request.receiver?.avatar;
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
                {isReceived ? "Swap request from" : "Swap request to"}
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
            label={isReceived ? "They offer" : "You offer"}
          />

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ArrowLeftRight size={18} />
          </div>

          <ClothingDetails
            item= {{title: request.receiver_item_title,brand: request.receiver_item_brand,size: request.receiver_item_size,condition: request.receiver_item_condition,}}
            label={isReceived ? "They request" : "You request"}
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
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            View Details
            <ChevronRight size={16} />
          </button>

          {isReceived && status === "PENDING" ? (
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
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests,setSentRequests] = useState([]);
  const [activeTab,setActiveTab] = useState("received");
  const [loading,setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const requests =
    activeTab === "sent" ? sentRequests || [] : receivedRequests || [];
  const isReceived = activeTab !== "sent";
  useEffect(()=>{
    const loadRequest = async()=>{
        try{
            setLoading(true);
            const [receivedResponse,sentResponse]=await Promise.all([
                getReceivedRequests(),
                getSentRequests(),
            ]);
            setReceivedRequests(receivedResponse.data.requests || []);
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
      setReceivedRequests((prev) =>
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
        setReceivedRequests((prev)=>
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
    console.log("View Swap Requests:",request);
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
                onClick={() => setActiveTab("received")}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                  activeTab !== "sent"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Inbox size={17} />
                Received
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeTab !== "sent"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {receivedRequests?.length || 0}
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
                {isReceived ? <Inbox size={30} /> : <Send size={30} />}
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                No {isReceived ? "received" : "sent"} requests yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {isReceived
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
                  isReceived={isReceived}
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
    </DashboardLayout>
  );
}