import {
  ArrowLeftRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  History,
  MessageSquare,
  Package,
  RotateCcw,
  XCircle,
} from "lucide-react";
import DashboardLayout from "../../components/DashbaordLayout";
const statusStyles = {
  ACCEPTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-600/20",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  COMPLETED: "bg-sky-50 text-sky-700 ring-sky-600/20",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const formatStatus = (status = "") =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

function ClothingItem({ item }) {
  if (!item) {
    return (
      <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-400">Item unavailable</p>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Package size={19} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">
            {item.name || item.title || "Clothing item"}
          </p>
          <p className="mt-1 truncate text-xs font-medium text-slate-500">
            {item.brand || "Brand not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}

function SwapHistoryCard({ swap }) {
  const status = String(
    swap.status || swap.swap_status || "PENDING"
  ).toUpperCase();

  const statusClass =
    statusStyles[status] || "bg-slate-100 text-slate-600 ring-slate-500/20";

  const senderName =
    swap.sender_name || swap.sender?.name || "ClothSwap member";

  const recieverName =
    swap.reciever_name || swap.reciever?.name || "ClothSwap member";

  const offeredItem =
    swap.offered_clothing ||
    swap.offered_item ||
    swap.offeredItem ||
    swap.sender_item;

  const requestedItem =
    swap.requested_clothing ||
    swap.requested_item ||
    swap.requestedItem ||
    swap.reciever_item;

  const swapDate =
    swap.swap_date || swap.date || swap.created_at || swap.updated_at;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ArrowLeftRight size={20} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Swap participants
              </p>
              <h2 className="text-base font-bold text-slate-900">
                {senderName}{" "}
                <span className="font-normal text-slate-400">with</span>{" "}
                {recieverName}
              </h2>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${statusClass}`}
          >
            {status === "ACCEPTED" || status === "COMPLETED" ? (
              <CheckCircle2 size={14} />
            ) : null}
            {status === "REJECTED" || status === "CANCELLED" ? (
              <XCircle size={14} />
            ) : null}
            {status === "PENDING" ? <Clock3 size={14} /> : null}
            {formatStatus(status)}
          </span>
        </div>

        {swapDate ? (
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays size={14} />
            <span>{swapDate}</span>
          </div>
        ) : null}
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <ClothingItem item={offeredItem} />

          <div className="mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ArrowLeftRight size={18} />
          </div>

          <ClothingItem item={requestedItem} />
        </div>

        {swap.message ? (
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
                {swap.message}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">
            <MessageSquare size={17} />
            No message was added to this swap.
          </div>
        )}
      </div>
    </article>
  );
}

export default function SwapHistory({
  history,
  activeFilter,
  onFilterChange,
}) {
  const filteredHistory =
    activeFilter === "all"
      ? history || []
      : (history || []).filter(
          (swap) =>
            String(swap.status || swap.swap_status || "").toLowerCase() ===
            activeFilter.toLowerCase()
        );

  const filters = [
    {
      key: "all",
      label: "All",
      icon: <History size={16} />,
    },
    {
      key: "accepted",
      label: "Accepted",
      icon: <CheckCircle2 size={16} />,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <XCircle size={16} />,
    },
  ];

  return (
    <DashboardLayout>
      <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <RotateCcw size={14} />
                ClothSwap activity
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Swap History
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Review your completed and declined clothing exchanges in one
                place.
              </p>
            </div>

            <div className="flex w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-fit">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.key;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => onFilterChange?.(filter.key)}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {filter.icon}
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <section className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                <History size={30} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                No swap history found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {activeFilter === "all"
                  ? "Your completed and declined clothing swaps will appear here."
                  : `You do not have any ${activeFilter} swaps yet.`}
              </p>
            </section>
          ) : (
            <section className="grid gap-5 xl:grid-cols-2">
              {filteredHistory.map((swap) => (
                <SwapHistoryCard
                  key={swap.id || swap.swap_id}
                  swap={swap}
                />
              ))}
            </section>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}