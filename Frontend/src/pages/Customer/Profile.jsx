import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashbaordLayout";

import {
  getProfile,
  deleteAccount,
  getDashboardStats,
} from "../../services/userServices";

import { getUserReviews, getMyReviews } from "../../services/reviewServices";

import { Star, MessageSquare, PenLine } from "lucide-react";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    listings: 0,
    successfulSwaps: 0,
    swapRequests: 0,
    pendingSwaps: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Review states
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // =========================================================
  // FETCH PROFILE + DASHBOARD
  // =========================================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const profileResponse = await getProfile();

        setUser(profileResponse.data.user);

        const dashboardResponse = await getDashboardStats();

        setDashboard(dashboardResponse.data.stats);

        setRecentActivity(dashboardResponse.data.recentActivity || []);

        setProfileCompletion(dashboardResponse.data.profileCompletion || 0);
      } catch (error) {
        console.error("FETCH DASHBOARD ERROR:", error);

        toast.error(
          error.response?.data?.message || "Unable to fetch dashboard",
        );

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  useEffect(() => {
    if (!user?.id) return;

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const [receivedResponse, givenResponse] = await Promise.all([
          getUserReviews(user.id),
          getMyReviews(),
        ]);

        const received = receivedResponse.data.reviews || [];

        const given = givenResponse.data.reviews || [];

        setReceivedReviews(received);
        setGivenReviews(given);

        // Update displayed rating
        // from reviews received by this user
        if (received.length > 0) {
          const totalRating = received.reduce(
            (sum, review) => sum + Number(review.rating),
            0,
          );

          const averageRating = totalRating / received.length;

          setUser((previousUser) => {
            if (!previousUser) return previousUser;

            return {
              ...previousUser,
              rating: averageRating,
            };
          });
        }
      } catch (error) {
        console.error("FETCH REVIEWS ERROR:", error);

        toast.error(error.response?.data?.message || "Unable to fetch reviews");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [user?.id]);
  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteAccount();

      toast.success(response.data.message);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete account");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  // =========================================================
  // RATING HELPERS
  // =========================================================

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= numericRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }
          />
        ))}
      </div>
    );
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <DashboardLayout user={user} showNavbar={false}>
      <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Account settings
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight">My Profile</h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and ClothSwap preferences.
          </p>
        </div>

        {/* =====================================================
            PROFILE CARD
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-36 bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-400" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                {/* Profile Image */}

                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-linear-to-br from-emerald-100 via-teal-100 to-slate-200 text-4xl font-bold text-emerald-700 shadow-lg">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={`${user?.full_name || "User"} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.full_name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>

                {/* User Name */}

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold">{user?.full_name}</h3>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Verified member
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Sustainable fashion enthusiast · {user?.city}, {user?.state}
                  </p>
                </div>
              </div>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/update-profile"
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                >
                  Edit Profile
                </Link>

                <Link
                  to="/update-profile"
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Change Password
                </Link>
              </div>
            </div>

            {/* User Details */}

            <div className="mt-8 grid gap-6 border-t border-slate-100 pt-7 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="mt-2 text-sm font-medium">{user?.email}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Phone
                </p>

                <p className="mt-2 text-sm font-medium">{user?.phone}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  City
                </p>

                <p className="mt-2 text-sm font-medium">{user?.city}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  State
                </p>

                <p className="mt-2 text-sm font-medium">{user?.state}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Role
                </p>

                <p className="mt-2 text-sm font-medium">{user?.role}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* Listings */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📦</span>

              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                Active
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">Listings</p>

            <p className="mt-1 text-3xl font-bold">{dashboard.listings}</p>
          </div>

          {/* Successful Swaps */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">✅</span>

              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                Great work
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">Successful Swaps</p>

            <p className="mt-1 text-3xl font-bold">
              {dashboard.successfulSwaps}
            </p>
          </div>

          {/* Swap Requests */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔄</span>

              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">
                {dashboard.pendingSwaps} pending
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">Swap Requests</p>

            <p className="mt-1 text-3xl font-bold">{dashboard.pendingSwaps}</p>
          </div>

          {/* Rating */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">⭐</span>

              <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-600">
                Community
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">Your Rating</p>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-3xl font-bold">
                {Number(user?.rating || 0).toFixed(1)}
              </p>

              <span className="text-sm text-slate-400">/ 5</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            REVIEWS & RATINGS
        ===================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {/* Reviews Header */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Star size={22} className="fill-yellow-400 text-yellow-400" />

                <h3 className="text-xl font-bold">Reviews & Ratings</h3>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                See what the ClothSwap community says about your swaps.
              </p>
            </div>

            {/* Overall Rating */}

            <div className="rounded-xl bg-yellow-50 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">
                Overall Rating
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {Number(user?.rating || 0).toFixed(1)}
                </span>

                <span className="text-sm text-slate-500">/ 5</span>

                {renderStars(user?.rating)}
              </div>
            </div>
          </div>

          {/* Review Content */}

          {reviewsLoading ? (
            <div className="mt-8 flex items-center justify-center rounded-xl bg-slate-50 py-12">
              <p className="text-sm text-slate-400">Loading reviews...</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {/* =================================================
                  RECEIVED REVIEWS
              ================================================= */}

              <div>
                <div className="mb-5 flex items-center gap-2">
                  <MessageSquare size={19} className="text-emerald-600" />

                  <h4 className="font-bold">Reviews Received</h4>

                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                    {receivedReviews.length}
                  </span>
                </div>

                {receivedReviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <Star size={28} className="mx-auto text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      No reviews yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Complete successful swaps to receive reviews from other
                      members.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedReviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {/* Reviewer Image */}

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-bold text-emerald-700">
                              {review.reviewer_image ? (
                                <img
                                  src={review.reviewer_image}
                                  alt={review.reviewer_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                review.reviewer_name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                {review.reviewer_name}
                              </p>

                              <p className="text-xs text-slate-400">
                                {new Date(
                                  review.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {renderStars(review.rating)}
                        </div>

                        {review.comment && (
                          <p className="mt-4 text-sm leading-6 text-slate-600">
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* =================================================
                  GIVEN REVIEWS
              ================================================= */}

              <div>
                <div className="mb-5 flex items-center gap-2">
                  <PenLine size={19} className="text-emerald-600" />

                  <h4 className="font-bold">Reviews Given</h4>

                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                    {givenReviews.length}
                  </span>
                </div>

                {givenReviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <PenLine size={28} className="mx-auto text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      No reviews given yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      After completing a swap, you can rate the other
                      participant.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {givenReviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {/* Reviewed User Image */}

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 font-bold text-teal-700">
                              {review.reviewed_user_image ? (
                                <img
                                  src={review.reviewed_user_image}
                                  alt={review.reviewed_user_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                review.reviewed_user_name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                {review.reviewed_user_name}
                              </p>

                              <p className="text-xs text-slate-400">
                                {new Date(
                                  review.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {renderStars(review.rating)}
                        </div>

                        {review.comment && (
                          <p className="mt-4 text-sm leading-6 text-slate-600">
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* =====================================================
            RECENT SWAP ACTIVITY + PROFILE COMPLETION
        ===================================================== */}

        <section className="grid gap-6 xl:grid-cols-5">
          {/* Recent Activity */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 xl:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Recent Swap Activity</h3>

                <p className="mt-1 text-sm text-slate-400">
                  Your latest community interactions
                </p>
              </div>

              <Link
                to="/history"
                className="text-sm font-semibold text-emerald-600"
              >
                View all
              </Link>
            </div>

            <div className="relative mt-8 space-y-8 before:absolute before:bottom-2 before:left-3.75 before:top-2 before:w-px before:bg-slate-200">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No recent swap activity.
                </p>
              ) : (
                recentActivity.map((activity) => {
                  const isSender =
                    Number(activity.sender_id) === Number(user?.id);

                  const otherUser = isSender
                    ? activity.reciever_name
                    : activity.sender_name;

                  return (
                    <div key={activity.id} className="relative flex gap-4">
                      {/* Activity Icon */}

                      <div
                        className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                          activity.status === "ACCEPTED"
                            ? "bg-emerald-100"
                            : "bg-amber-100"
                        }`}
                      >
                        {activity.status === "ACCEPTED" ? "✓" : "↗"}
                      </div>

                      {/* Activity Content */}

                      <div>
                        <p className="text-sm font-semibold">
                          {activity.status === "ACCEPTED"
                            ? `Swap completed with ${otherUser}`
                            : `Swap request with ${otherUser}`}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {isSender
                            ? `You offered ${
                                activity.sender_item_title || "an item"
                              }.`
                            : `${otherUser || "The user"} offered ${
                                activity.sender_item_title || "an item"
                              }.`}
                        </p>

                        <p className="mt-2 text-xs font-medium text-emerald-600">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Profile Completion */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 xl:col-span-2">
            <h3 className="text-lg font-bold">Profile Completion</h3>

            <p className="mt-1 text-sm text-slate-400">
              Complete your profile to build trust.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <div
                className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#10b981 ${
                    profileCompletion * 3.6
                  }deg,#e2e8f0 ${profileCompletion * 3.6}deg 360deg)`,
                }}
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-900">
                      {profileCompletion}%
                    </p>

                    <p className="text-xs text-slate-400">Complete</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-emerald-600">
                  <span>✓</span>
                  <span>Basic information</span>
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    user?.profile_image ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  <span>{user?.profile_image ? "✓" : "○"}</span>

                  <span>Profile photo</span>
                </div>
              </div>
            </div>

            <Link
              to="/update-profile"
              className="mt-8 block rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
            >
              Complete Profile
            </Link>
          </div>
        </section>

        {/* =====================================================
            DANGER ZONE
        ===================================================== */}

        <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-red-100 bg-red-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="font-bold text-red-900">Danger Zone</h3>

            <p className="mt-1 text-sm text-red-700">
              Deleting your account permanently removes your profile and
              activity.
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="cursor-pointer rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            Delete Account
          </button>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© 2024 ClothSwap. Make fashion circular.</p>

          <div className="flex gap-5">
            <a href="#" className="hover:text-emerald-600">
              Help Center
            </a>

            <a href="#" className="hover:text-emerald-600">
              Privacy
            </a>

            <a href="#" className="hover:text-emerald-600">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
