import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
  BarChart3,
  Users,
  Shirt,
  ArrowLeftRight,
  Clock3,
  TrendingUp,
  MapPin,
  Star,
  RefreshCw,
  PackageCheck,
  PackageX,
  ShieldAlert,
  Download,
  Image,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../../components/AdminLayout";

import { getAnalytics } from "../../services/adminServices";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [days, setDays] = useState(30);
  /*
    ==================================================
    LOAD ANALYTICS
    ==================================================
    */
  useEffect(() => {
    let cancelled = false;
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics(days);
        if (!cancelled) {
          setAnalytics(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("ADMIN ANALYTICS ERROR:", error);
          toast.error(
            error.response?.data?.message || "Failed to load analytics",
          );
          setLoading(false);
        }
      }
    };
    fetchAnalytics();
    return () => {
      cancelled = true;
    };
  }, [days]);
  /*
    ==================================================
    REFRESH
    ==================================================
    */

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const response = await getAnalytics(days);

      setAnalytics(response.data);

      toast.success("Analytics updated");
    } catch (error) {
      console.error("REFRESH ANALYTICS ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to refresh analytics",
      );
    } finally {
      setRefreshing(false);
    }
  };

  /*
    ==================================================
    LOADING
    ==================================================
    */

  if (loading || !analytics) {
    return (
      <AdminLayout>
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading platform analytics...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const summary = analytics.summary || {};

  const activity = analytics.activity || [];

  const listingStatus = analytics.listingStatus || [];

  const swapStatus = analytics.swapStatus || [];

  const categories = analytics.categories || [];

  const locations = analytics.locations || [];

  const conditions = analytics.conditions || [];
  const createSVGMetricCard = (x, y, title, value) => {
    return `
        <rect
            x="${x}"
            y="${y}"
            width="240"
            height="75"
            rx="14"
            fill="#ffffff"
            stroke="#e2e8f0"
        />

        <text
            x="${x + 20}"
            y="${y + 27}"
            font-family="Arial, sans-serif"
            font-size="13"
            fill="#64748b"
        >
            ${title}
        </text>

        <text
            x="${x + 20}"
            y="${y + 55}"
            font-family="Arial, sans-serif"
            font-size="24"
            font-weight="700"
            fill="#0f172a"
        >
            ${Number(value || 0).toLocaleString()}
        </text>
    `;
  };
  const createSVGList = (data, labelKey, x, y) => {
    return data
      .map((item, index) => {
        const label = String(item[labelKey] || "Unknown")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        const count = Number(item.count || 0);

        const rowY = y + index * 32;

        return `
                <text
                    x="${x}"
                    y="${rowY}"
                    font-family="Arial, sans-serif"
                    font-size="14"
                    fill="#475569"
                >
                    ${label}
                </text>

                <text
                    x="${x + 480}"
                    y="${rowY}"
                    font-family="Arial, sans-serif"
                    font-size="14"
                    font-weight="700"
                    text-anchor="end"
                    fill="#0f172a"
                >
                    ${count.toLocaleString()}
                </text>
            `;
      })
      .join("");
  };
  const addPDFSectionTitle = (pdf, title, margin, y) => {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);

    pdf.text(title, margin, y);

    return y + 7;
  };
  const addPDFTable = (
    pdf,
    data,
    labelKey,
    margin,
    y,
    pageWidth,
    pageHeight,
  ) => {
    if (!data || data.length === 0) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");

      pdf.text("No data available.", margin, y);

      return y + 7;
    }

    const tableWidth = pageWidth - margin * 2;

    const labelWidth = tableWidth * 0.7;

    /*
    HEADER
    */

    pdf.setFillColor(241, 245, 249);

    pdf.rect(margin, y, tableWidth, 8, "F");

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");

    pdf.setTextColor(51, 65, 85);

    pdf.text("Name", margin + 3, y + 5.5);

    pdf.text("Count", margin + labelWidth + 3, y + 5.5);

    y += 8;

    /*
    ROWS
    */

    data.forEach((item, index) => {
      if (y > pageHeight - 20) {
        pdf.addPage();

        y = margin;

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");

        pdf.setTextColor(51, 65, 85);

        pdf.text("Name", margin + 3, y + 5.5);

        pdf.text("Count", margin + labelWidth + 3, y + 5.5);

        y += 8;
      }

      if (index % 2 === 0) {
        pdf.setFillColor(248, 250, 252);

        pdf.rect(margin, y, tableWidth, 7, "F");
      }

      const label = item[labelKey] || "Unknown";

      const count = Number(item.count || 0);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");

      pdf.setTextColor(71, 85, 105);

      pdf.text(formatStatus(label), margin + 3, y + 5);

      pdf.text(count.toLocaleString(), margin + labelWidth + 3, y + 5);

      y += 7;
    });

    return y;
  };
  /*
    ==================================================
    ACTIVITY MAX
    ==================================================
    */

  const maxActivity = Math.max(
    ...activity.map((item) =>
      Math.max(
        Number(item.new_users || 0),
        Number(item.new_listings || 0),
        Number(item.swap_requests || 0),
      ),
    ),

    1,
  );
  /*
    ==================================================
    RENDER
    ==================================================
    */
  const exportAnalyticsAsImage = () => {
    try {
      toast.loading("Generating analytics image...", {
        id: "analytics-export",
      });

      const width = 1200;
      const height = 900;

      const escapeXML = (value) => {
        return String(value ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      };

      const svg = `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="${width}"
                height="${height}"
                viewBox="0 0 ${width} ${height}"
            >

                <rect
                    width="100%"
                    height="100%"
                    fill="#f8fafc"
                />

                <!-- HEADER -->

                <text
                    x="60"
                    y="65"
                    font-family="Arial, sans-serif"
                    font-size="32"
                    font-weight="700"
                    fill="#0f172a"
                >
                    ClothSwap Platform Analytics
                </text>

                <text
                    x="60"
                    y="95"
                    font-family="Arial, sans-serif"
                    font-size="16"
                    fill="#64748b"
                >
                    Last ${days} Days
                </text>

                <!-- KPI CARDS -->

                ${createSVGMetricCard(
                  60,
                  130,
                  "Total Users",
                  summary.total_users,
                )}

                ${createSVGMetricCard(
                  330,
                  130,
                  "Total Listings",
                  summary.total_listings,
                )}

                ${createSVGMetricCard(
                  600,
                  130,
                  "Completed Swaps",
                  summary.completed_swaps,
                )}

                ${createSVGMetricCard(
                  870,
                  130,
                  "Pending Swaps",
                  summary.pending_swaps,
                )}

                <!-- LISTING STATUS -->

                <text
                    x="60"
                    y="230"
                    font-family="Arial, sans-serif"
                    font-size="20"
                    font-weight="700"
                    fill="#0f172a"
                >
                    Listing Status
                </text>

                ${createSVGList(listingStatus, "status", 60, 260)}

                <!-- SWAP STATUS -->

                <text
                    x="630"
                    y="230"
                    font-family="Arial, sans-serif"
                    font-size="20"
                    font-weight="700"
                    fill="#0f172a"
                >
                    Swap Status
                </text>

                ${createSVGList(swapStatus, "status", 630, 260)}

                <!-- CATEGORIES -->

                <text
                    x="60"
                    y="470"
                    font-family="Arial, sans-serif"
                    font-size="20"
                    font-weight="700"
                    fill="#0f172a"
                >
                    Popular Categories
                </text>

                ${createSVGList(categories.slice(0, 6), "category", 60, 500)}

                <!-- LOCATIONS -->

                <text
                    x="630"
                    y="470"
                    font-family="Arial, sans-serif"
                    font-size="20"
                    font-weight="700"
                    fill="#0f172a"
                >
                    Top User Locations
                </text>

                ${createSVGList(locations.slice(0, 6), "city", 630, 500)}

                <!-- VALUE -->

                <rect
                    x="60"
                    y="700"
                    width="1080"
                    height="120"
                    rx="16"
                    fill="#ffffff"
                    stroke="#e2e8f0"
                />

                <text
                    x="90"
                    y="735"
                    font-family="Arial, sans-serif"
                    font-size="18"
                    font-weight="700"
                    fill="#0f172a"
                >
                    Listing Value
                </text>

                <text
                    x="90"
                    y="775"
                    font-family="Arial, sans-serif"
                    font-size="16"
                    fill="#64748b"
                >
                    Total Value:
                </text>

                <text
                    x="210"
                    y="775"
                    font-family="Arial, sans-serif"
                    font-size="18"
                    font-weight="700"
                    fill="#0f172a"
                >
                    ${escapeXML(formatCurrency(summary.total_listing_value))}
                </text>

                <text
                    x="600"
                    y="775"
                    font-family="Arial, sans-serif"
                    font-size="16"
                    fill="#64748b"
                >
                    Average Value:
                </text>

                <text
                    x="750"
                    y="775"
                    font-family="Arial, sans-serif"
                    font-size="18"
                    font-weight="700"
                    fill="#0f172a"
                >
                    ${escapeXML(formatCurrency(summary.average_listing_value))}
                </text>

                <text
                    x="60"
                    y="860"
                    font-family="Arial, sans-serif"
                    font-size="12"
                    fill="#94a3b8"
                >
                    Generated ${new Date().toLocaleDateString("en-IN")}
                </text>

            </svg>
        `;

      const blob = new Blob([svg], {
        type: "image/svg+xml;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `clothswap-analytics-${days}-days.svg`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success("Analytics image exported successfully", {
        id: "analytics-export",
      });
    } catch (error) {
      console.error("ANALYTICS IMAGE EXPORT ERROR:", error);

      toast.error("Failed to export analytics image", {
        id: "analytics-export",
      });
    }
  };
  const exportAnalyticsAsPDF = () => {
    try {
      toast.loading("Generating analytics PDF...", {
        id: "analytics-pdf",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();

      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 15;

      let y = 18;

      /*
        ==================================================
        HEADER
        ==================================================
        */

      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");

      pdf.text("ClothSwap Platform Analytics", margin, y);

      y += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      pdf.text(`Analytics Period: Last ${days} Days`, margin, y);

      y += 5;

      pdf.text(
        `Generated: ${new Date().toLocaleDateString("en-IN")}`,
        margin,
        y,
      );

      y += 10;

      /*
        ==================================================
        KPI SUMMARY
        ==================================================
        */

      pdf.setFontSize(15);
      pdf.setFont("helvetica", "bold");

      pdf.text("Platform Overview", margin, y);

      y += 8;

      const kpis = [
        ["Total Users", Number(summary.total_users || 0)],
        ["Total Listings", Number(summary.total_listings || 0)],
        ["Completed Swaps", Number(summary.completed_swaps || 0)],
        ["Pending Swaps", Number(summary.pending_swaps || 0)],
      ];

      const boxWidth = (pageWidth - margin * 2 - 9) / 4;

      kpis.forEach((item, index) => {
        const x = margin + index * (boxWidth + 3);

        pdf.setDrawColor(220, 226, 232);
        pdf.setFillColor(248, 250, 252);

        pdf.roundedRect(x, y, boxWidth, 25, 3, 3, "FD");

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");

        pdf.text(item[0], x + 4, y + 7);

        pdf.setFontSize(15);
        pdf.setFont("helvetica", "bold");

        pdf.text(item[1].toLocaleString(), x + 4, y + 18);
      });

      y += 35;

      /*
        ==================================================
        LISTING STATUS
        ==================================================
        */

      y = addPDFSectionTitle(pdf, "Listing Status", margin, y);

      y = addPDFTable(
        pdf,
        listingStatus,
        "status",
        margin,
        y,
        pageWidth,
        pageHeight,
      );

      y += 8;

      /*
        ==================================================
        SWAP STATUS
        ==================================================
        */

      y = addPDFSectionTitle(pdf, "Swap Status", margin, y);

      y = addPDFTable(
        pdf,
        swapStatus,
        "status",
        margin,
        y,
        pageWidth,
        pageHeight,
      );

      y += 8;

      /*
        ==================================================
        POPULAR CATEGORIES
        ==================================================
        */

      y = addPDFSectionTitle(pdf, "Popular Categories", margin, y);

      y = addPDFTable(
        pdf,
        categories,
        "category",
        margin,
        y,
        pageWidth,
        pageHeight,
      );

      y += 8;

      /*
        ==================================================
        LOCATIONS
        ==================================================
        */

      y = addPDFSectionTitle(pdf, "Top User Locations", margin, y);

      y = addPDFTable(pdf, locations, "city", margin, y, pageWidth, pageHeight);

      y += 8;

      /*
        ==================================================
        CONDITIONS
        ==================================================
        */

      y = addPDFSectionTitle(pdf, "Clothing Conditions", margin, y);

      y = addPDFTable(
        pdf,
        conditions,
        "condition",
        margin,
        y,
        pageWidth,
        pageHeight,
      );

      /*
        ==================================================
        VALUE SUMMARY
        ==================================================
        */

      if (y > pageHeight - 45) {
        pdf.addPage();

        y = margin;
      }

      y = addPDFSectionTitle(pdf, "Listing Value", margin, y);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      pdf.text(
        `Total Listing Value: ${formatCurrency(summary.total_listing_value)}`,
        margin,
        y,
      );

      y += 7;

      pdf.text(
        `Average Listing Value: ${formatCurrency(
          summary.average_listing_value,
        )}`,
        margin,
        y,
      );

      y += 15;

      /*
        ==================================================
        ADDITIONAL SUMMARY
        ==================================================
        */

      y = addPDFSectionTitle(pdf, "Additional Platform Metrics", margin, y);

      const additionalMetrics = [
        ["Suspended Users", summary.suspended_users],
        ["Rejected Swaps", summary.rejected_swaps],
        ["Cancelled Swaps", summary.cancelled_swaps],
        ["Removed Listings", summary.removed_listings],
      ];

      additionalMetrics.forEach((item) => {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        pdf.text(
          `${item[0]}: ${Number(item[1] || 0).toLocaleString()}`,
          margin,
          y,
        );

        y += 6;
      });

      /*
        ==================================================
        FOOTER
        ==================================================
        */

      const totalPages = pdf.internal.getNumberOfPages();

      for (let page = 1; page <= totalPages; page++) {
        pdf.setPage(page);

        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");

        pdf.setTextColor(120, 120, 120);

        pdf.text(
          `ClothSwap Analytics • Page ${page} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 8,
          {
            align: "center",
          },
        );
      }

      pdf.save(`clothswap-analytics-${days}-days.pdf`);

      toast.success("Analytics PDF exported successfully", {
        id: "analytics-pdf",
      });
    } catch (error) {
      console.error("ANALYTICS PDF EXPORT ERROR:", error);

      toast.error("Failed to generate analytics PDF", {
        id: "analytics-pdf",
      });
    }
  };
  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-1">
        {/* ============================================== */}
        {/* HEADER */}
        {/* ============================================== */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
                  <BarChart3 size={27} className="text-indigo-600" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Analytics
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Understand platform growth, listings and swap activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* PERIOD */}

              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              >
                <option value={7}>Last 7 Days</option>

                <option value={30}>Last 30 Days</option>

                <option value={90}>Last 90 Days</option>

                <option value={365}>Last 12 Months</option>
              </select>

              {/* REFRESH */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={exportAnalyticsAsImage}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Image size={17} />
                  Export Image
                </button>

                <button
                  onClick={exportAnalyticsAsPDF}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  <Download size={17} />
                  Export PDF
                </button>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={17}
                    className={refreshing ? "animate-spin" : ""}
                  />

                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================== */}
        {/* KPI CARDS */}
        {/* ============================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Users"
            value={summary.total_users}
            icon={<Users size={22} />}
            description={`${summary.active_users || 0} active accounts`}
            iconClass="bg-blue-50 text-blue-600"
          />

          <MetricCard
            title="Total Listings"
            value={summary.total_listings}
            icon={<Shirt size={22} />}
            description={`${summary.available_listings || 0} currently available`}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <MetricCard
            title="Completed Swaps"
            value={summary.completed_swaps}
            icon={<ArrowLeftRight size={22} />}
            description={`${summary.total_swap_requests || 0} total requests`}
            iconClass="bg-purple-50 text-purple-600"
          />

          <MetricCard
            title="Pending Swaps"
            value={summary.pending_swaps}
            icon={<Clock3 size={22} />}
            description="Requests awaiting action"
            iconClass="bg-amber-50 text-amber-600"
          />
        </div>

        {/* ============================================== */}
        {/* ACTIVITY CHART */}
        {/* ============================================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Platform Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Daily users, listings and swap requests.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <Legend label="Users" className="bg-blue-500" />

              <Legend label="Listings" className="bg-emerald-500" />

              <Legend label="Swaps" className="bg-purple-500" />
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <div
              className="flex min-w-175 items-end gap-2"
              style={{
                height: "260px",
              }}
            >
              {activity.map((item) => {
                const users = Number(item.new_users || 0);

                const listings = Number(item.new_listings || 0);

                const swaps = Number(item.swap_requests || 0);

                return (
                  <div
                    key={item.date}
                    className="group flex h-full flex-1 min-w-4.5 items-end justify-center gap-0.5"
                    title={`${item.date}: ${users} users, ${listings} listings, ${swaps} swaps`}
                  >
                    <div
                      className="w-full max-w-2 rounded-t bg-blue-500 transition hover:opacity-80"
                      style={{
                        height: `${Math.max(
                          (users / maxActivity) * 220,
                          users > 0 ? 8 : 2,
                        )}px`,
                      }}
                    />

                    <div
                      className="w-full max-w-2 rounded-t bg-emerald-500 transition hover:opacity-80"
                      style={{
                        height: `${Math.max(
                          (listings / maxActivity) * 220,
                          listings > 0 ? 8 : 2,
                        )}px`,
                      }}
                    />

                    <div
                      className="w-full max-w-2 rounded-t bg-purple-500 transition hover:opacity-80"
                      style={{
                        height: `${Math.max(
                          (swaps / maxActivity) * 220,
                          swaps > 0 ? 8 : 2,
                        )}px`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex min-w-175 justify-between text-[10px] text-slate-400">
              {activity.length > 0 && (
                <>
                  <span>{formatDate(activity[0].date)}</span>

                  <span>
                    {formatDate(activity[Math.floor(activity.length / 2)].date)}
                  </span>

                  <span>{formatDate(activity[activity.length - 1].date)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ============================================== */}
        {/* STATUS CARDS */}
        {/* ============================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LISTING STATUS */}

          <DistributionCard
            title="Listing Status"
            subtitle="Current state of clothing listings"
            icon={<Shirt size={20} />}
            data={listingStatus}
            type="listing"
          />

          {/* SWAP STATUS */}

          <DistributionCard
            title="Swap Status"
            subtitle="Current lifecycle of swap requests"
            icon={<ArrowLeftRight size={20} />}
            data={swapStatus}
            type="swap"
          />
        </div>

        {/* ============================================== */}
        {/* CATEGORIES + LOCATIONS */}
        {/* ============================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* CATEGORIES */}

          <RankingCard
            title="Popular Categories"
            subtitle="Most listed clothing categories"
            icon={<TrendingUp size={20} />}
            data={categories}
            labelKey="category"
          />

          {/* LOCATIONS */}

          <RankingCard
            title="Top User Locations"
            subtitle="Cities with the most registered users"
            icon={<MapPin size={20} />}
            data={locations}
            labelKey="city"
          />
        </div>

        {/* ============================================== */}
        {/* VALUE + CONDITIONS */}
        {/* ============================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* VALUE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Star size={20} className="fill-amber-400" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">Listing Value</h2>

                <p className="text-sm text-slate-500">
                  Estimated swap value across listings
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <ValueBox
                label="Total Value"
                value={formatCurrency(summary.total_listing_value)}
              />

              <ValueBox
                label="Average Value"
                value={formatCurrency(summary.average_listing_value)}
              />
            </div>
          </div>

          {/* CONDITIONS */}

          <RankingCard
            title="Clothing Conditions"
            subtitle="Distribution of listing conditions"
            icon={<PackageCheck size={20} />}
            data={conditions}
            labelKey="condition"
          />
        </div>

        {/* ============================================== */}
        {/* ADDITIONAL SUMMARY */}
        {/* ============================================== */}

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStat
            label="Suspended Users"
            value={summary.suspended_users}
            icon={<ShieldAlert size={18} />}
          />

          <MiniStat
            label="Rejected Swaps"
            value={summary.rejected_swaps}
            icon={<PackageX size={18} />}
          />

          <MiniStat
            label="Cancelled Swaps"
            value={summary.cancelled_swaps}
            icon={<ArrowLeftRight size={18} />}
          />

          <MiniStat
            label="Removed Listings"
            value={summary.removed_listings}
            icon={<PackageX size={18} />}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

/*
=====================================================
METRIC CARD
=====================================================
*/

const MetricCard = ({ title, value, description, icon, iconClass }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {Number(value || 0).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/*
=====================================================
LEGEND
=====================================================
*/

const Legend = ({ label, className }) => {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />

      {label}
    </span>
  );
};

/*
=====================================================
DISTRIBUTION CARD
=====================================================
*/

const DistributionCard = ({ title, subtitle, icon, data, type }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {icon}
        </div>

        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>

          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {data.length === 0 ? (
          <p className="text-sm text-slate-400">No data available.</p>
        ) : (
          data.map((item) => {
            const count = Number(item.count || 0);

            const percentage = Math.round(
              (count /
                data.reduce(
                  (sum, current) => sum + Number(current.count || 0),
                  0,
                )) *
                100,
            );

            return (
              <div key={item.status}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    {formatStatus(item.status)}
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={
                      type === "listing"
                        ? "h-full rounded-full bg-emerald-500 transition-all"
                        : "h-full rounded-full bg-purple-500 transition-all"
                    }
                    style={{
                      width: `${Math.max(percentage, count > 0 ? 3 : 0)}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-right text-xs text-slate-400">
                  {percentage}%
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/*
=====================================================
RANKING CARD
=====================================================
*/

const RankingCard = ({ title, subtitle, icon, data, labelKey }) => {
  const max = Math.max(...data.map((item) => Number(item.count || 0)), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>

          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-slate-400">No data available.</p>
        ) : (
          data.map((item, index) => {
            const count = Number(item.count || 0);

            const width = (count / max) * 100;

            return (
              <div key={`${item[labelKey]}-${index}`}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {item[labelKey]}
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    {count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{
                      width: `${width}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/*
=====================================================
VALUE BOX
=====================================================
*/

const ValueBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
};

/*
=====================================================
MINI STAT
=====================================================
*/

const MiniStat = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">{icon}</span>

        <span className="text-xl font-black text-slate-900">
          {Number(value || 0).toLocaleString()}
        </span>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
};

/*
=====================================================
HELPERS
=====================================================
*/

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default AdminAnalytics;
