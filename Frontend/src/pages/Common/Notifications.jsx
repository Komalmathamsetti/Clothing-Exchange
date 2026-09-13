import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationServices";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const userId = user?.id;

  // --------------------------------------------------
  // Fetch notifications
  // --------------------------------------------------

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await getNotifications();

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error(
        "FETCH NOTIFICATIONS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial fetch
  // --------------------------------------------------

  useEffect(() => {
    const loadNotifications = async()=>{
        await fetchNotifications();
    }
    loadNotifications();
  }, []);

  // --------------------------------------------------
  // Real-time notifications
  // --------------------------------------------------

  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:5000");

    socket.emit("join_user", userId);

    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [
        notification,
        ...prev,
      ]);
    });

    return () => {
      socket.off("new_notification");
      socket.disconnect();
    };
  }, [userId]);

  // --------------------------------------------------
  // Mark notification as read
  // --------------------------------------------------

  const handleMarkAsRead = async (notification) => {
    if (notification.is_read) return;

    try {
      await markNotificationAsRead(notification.id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Mark all as read
  // --------------------------------------------------

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS ERROR:",
        error
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // --------------------------------------------------
  // Delete notification
  // --------------------------------------------------

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification.id !== id
        )
      );
    } catch (error) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Notification icon
  // --------------------------------------------------

  const getNotificationIcon = (type) => {
    switch (type) {
      case "NEW_LISTING":
        return "👕";

      case "NEW_SWAP_REQUEST":
        return "🔄";

      case "SWAP_ACCEPTED":
        return "✅";

      case "SWAP_REJECTED":
        return "❌";

      case "SWAP_CANCELLED":
        return "🚫";

      case "SWAP_COMPLETED":
        return "🎉";

      case "DISPUTE_RAISED":
        return "⚠️";

      case "DISPUTE_STATUS_UPDATED":
        return "📋";

      case "DISPUTE_RESOLVED":
        return "✔️";

      case "NEW_MESSAGE":
        return "💬";

      case "ACCOUNT_DEACTIVATED":
        return "🔒";

      case "ADMIN_ANNOUNCEMENT":
        return "📢";

      default:
        return "🔔";
    }
  };

  // --------------------------------------------------
  // Format time
  // --------------------------------------------------

  const formatTime = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() -
      notificationDate.getTime();

    const seconds = Math.floor(
      difference / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes} min${
        minutes !== 1 ? "s" : ""
      } ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hour${
        hours !== 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} day${
        days !== 1 ? "s" : ""
      } ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.is_read
  ).length;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Stay updated with your clothing
              exchange activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {markingAll
                ? "Marking..."
                : "Mark all as read"}
            </button>
          )}
        </div>

        {/* Unread count */}
        {unreadCount > 0 && (
          <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-sm font-medium text-blue-700">
              You have {unreadCount} unread
              notification
              {unreadCount !== 1 ? "s" : ""}.
            </p>
          </div>
        )}

        {/* Empty state */}
        {notifications.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="mb-4 text-5xl">
              🔔
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-3">

            {notifications.map(
              (notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleMarkAsRead(
                      notification
                    )
                  }
                  className={`relative rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                    notification.is_read
                      ? "border-slate-200"
                      : "border-blue-200 bg-blue-50/40"
                  }`}
                >

                  <div className="flex gap-4">

                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${
                        notification.is_read
                          ? "bg-slate-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pr-8">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3
                          className={`text-sm font-semibold ${
                            notification.is_read
                              ? "text-slate-700"
                              : "text-slate-900"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {!notification.is_read && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatTime(
                          notification.created_at
                        )}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(
                          notification.id
                        );
                      }}
                      className="absolute right-4 top-4 text-slate-400 transition hover:text-red-500"
                      title="Delete notification"
                    >
                      ✕
                    </button>

                  </div>
                </div>
              )
            )}

          </div>
        )}
      </div>
    </div>
  );
}