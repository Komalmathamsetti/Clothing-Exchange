import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Send,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import DashboardLayout from "../../components/DashbaordLayout";

import {
  getMyChats,
  getChatMessages,
  sendMessage,
} from "../../services/chatServices";

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [user] = useState(()=>{
    const storedUser = localStorage.getItem("user");
    return storedUser?JSON.parse(storedUser):null;
  });
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  useEffect(()=>{
    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("connect",()=>{
        console.log("Socket connected:",socketRef.current.id);
    });
    return ()=>{
        socketRef.current.disconnect();
    };
  },[]);
  useEffect(()=>{
    if(!selectedChat || !socketRef.current){
        return;
    }
    socketRef.current.emit(
        "join_chat",
        selectedChat.chat_id
    );
    console.log("Joined Chat:",selectedChat.chat_id);
  },[selectedChat]);
  useEffect(() => {
  if (!socketRef.current || !selectedChat) {
    return;
  }
  const handleNewMessage = (newMessage) => {
    console.log(
      "REAL TIME MESSAGE:",
      newMessage
    );
    if (
      Number(newMessage.chat_id) !==
      Number(selectedChat.chat_id)
    ) {
      return;
    }

    setMessages((previousMessages) => {
      // Prevent duplicates
      if (
        previousMessages.some(
          (item) =>
            item.id === newMessage.id
        )
      ) {
        return previousMessages;
      }

      return [
        ...previousMessages,
        newMessage,
      ];
    });
  };

  socketRef.current.on(
    "new_message",
    handleNewMessage
  );

  return () => {
    socketRef.current.off(
      "new_message",
      handleNewMessage
    );
  };
  }, [selectedChat]);
  // =====================================================
  // LOAD CHATS
  // =====================================================

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoadingChats(true);

        const response = await getMyChats();

        const chatData = response.data?.chats || [];

        setChats(chatData);

        // Automatically select first chat
        if (chatData.length > 0) {
          setSelectedChat(chatData[0]);
        }
      } catch (error) {
        console.error("LOAD CHATS ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load conversations"
        );
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, []);

  // =====================================================
  // LOAD MESSAGES
  // =====================================================

  useEffect(() => {
  if (!selectedChat) {
    return;
  }

  const loadMessages = async () => {
    try {
      setLoadingMessages(true);

      const response = await getChatMessages(
        selectedChat.chat_id
      );

      setMessages(
        response.data?.messages || []
      );
    } catch (error) {
      console.error(
        "LOAD MESSAGES ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load messages"
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  loadMessages();
}, [selectedChat]);
  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSendMessage = async (e) => {
  e.preventDefault();

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return;
  }

  if (!selectedChat) {
    toast.error("Please select a conversation");
    return;
  }

  try {
    setSending(true);

    await sendMessage(
      selectedChat.chat_id,
      trimmedMessage
    );

    // Socket.IO will add the message to the UI
    setMessage("");

    // Update last message in conversation list
    setChats((previousChats) =>
      previousChats.map((chat) =>
        chat.chat_id === selectedChat.chat_id
          ? {
              ...chat,
              last_message: trimmedMessage,
              last_message_at: new Date().toISOString(),
            }
          : chat
      )
    );

  } catch (error) {
    console.error(
      "SEND MESSAGE ERROR:",
      error
    );

    toast.error(
      error.response?.data?.message ||
        "Failed to send message"
    );
  } finally {
    setSending(false);
  }
};
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };
  const storedUser =
    localStorage.getItem("user");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const currentUserId = currentUser?.id;
  return (
    <DashboardLayout user = {user} showNavbar={true}>
      <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <MessageCircle size={14} />
              ClothSwap Messages
            </div>

            <h1 className="mt-3 text-3xl font-black text-slate-950">
              Messages
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Discuss swap details and negotiate
              with other users.
            </p>
          </div>

          {/* CHAT CONTAINER */}

          <div className="grid min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:min-h-162.5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">

              <div className="border-b border-slate-100 p-5">
                <h2 className="font-bold text-slate-900">
                  Conversations
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {chats.length} conversation
                  {chats.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <div className="max-h-145 overflow-y-autmax-h-[300px] overflow-y-auto lg:max-h-145">

                {loadingChats ? (
                  <div className="p-6 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

                    <p className="mt-3 text-sm text-slate-400">
                      Loading conversations...
                    </p>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="p-8 text-center">

                    <MessageCircle
                      className="mx-auto text-slate-300"
                      size={40}
                    />

                    <h3 className="mt-4 font-semibold text-slate-700">
                      No conversations
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Conversations will appear
                      here after you send a swap
                      request.
                    </p>
                  </div>
                ) : (
                  chats.map((chat) => {

                    const isSelected =
                      selectedChat?.chat_id ===
                      chat.chat_id;

                    const otherUser =
                      chat.sender_id ===
                      currentUserId
                        ? chat.reciever_name
                        : chat.sender_name;

                    const otherItem =
                      chat.sender_id ===
                      currentUserId
                        ? chat.reciever_item_title
                        : chat.sender_item_title;
                    return (
                      <button
                        key={chat.chat_id}
                        type="button"
                        onClick={() =>
                          setSelectedChat(chat)
                        }
                        className={`w-full border-b border-slate-100 p-4 text-left transition ${
                          isSelected
                            ? "bg-emerald-50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                            {otherUser
                              ?.charAt(0)
                              ?.toUpperCase() || (
                              <User size={18} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-2">

                              <p className="truncate text-sm font-bold text-slate-900">
                                {otherUser ||
                                  "ClothSwap member"}
                              </p>

                              {chat.last_message_at && (
                                <span className="shrink-0 text-[10px] text-slate-400">
                                  {formatTime(
                                    chat.last_message_at
                                  )}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 truncate text-xs text-slate-400">
                              {otherItem ||
                                "Clothing swap"}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {chat.last_message ||
                                "Start a conversation"}
                            </p>

                          </div>
                        </div>
                      </button>
                    );
                  })
                )}

              </div>
            </aside>

            {/* =================================================
                CHAT WINDOW
            ================================================= */}

            <section className="flex min-h-125 flex-col lg:min-h-162.5">

              {!selectedChat ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                    <MessageCircle size={38} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    Select a conversation
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    Select a conversation from
                    the left to start discussing
                    your clothing swap.
                  </p>

                </div>
              ) : (
                <>
                  {/* CHAT HEADER */}

                  <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                        {(
                          selectedChat.sender_id ===
                          currentUserId
                            ? selectedChat.reciever_name
                            : selectedChat.sender_name
                        )
                          ?.charAt(0)
                          ?.toUpperCase() || (
                          <User size={18} />
                        )}
                      </div>

                      <div>

                        <h2 className="font-bold text-slate-900">
                          {selectedChat.sender_id ===
                          currentUserId
                            ? selectedChat.reciever_name
                            : selectedChat.sender_name}
                        </h2>

                        <p className="text-xs text-slate-400">
                          {selectedChat.sender_id ===
                          currentUserId
                            ? selectedChat.reciever_item_title
                            : selectedChat.sender_item_title}
                        </p>

                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                      {selectedChat.swap_status}
                    </span>

                  </div>

                  {/* MESSAGES */}

                  <div className="flex-1 overflow-y-auto bg-slate-50 p-5">

                    {loadingMessages ? (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                          <MessageCircle size={28} />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-800">
                          Start the conversation
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                          Discuss the swap and
                          exchange details.
                        </p>

                      </div>
                    ) : (
                      <div className="space-y-3">

                        {messages.map((item) => {

                          const isMine =
                            Number(item.sender_id) ===
                            Number(currentUserId);

                          return (
                            <div
                              key={item.id}
                              className={`flex ${
                                isMine
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[85%] wrap-break-word rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
                                  isMine
                                    ? "rounded-br-md bg-emerald-600 text-white"
                                    : "rounded-bl-md bg-white text-slate-700"
                                }`}
                              >
                                <p className="text-sm leading-6">
                                  {item.message}
                                </p>

                                <p
                                  className={`mt-1 text-[10px] ${
                                    isMine
                                      ? "text-emerald-100"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {formatTime(
                                    item.created_at
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        <div ref={messagesEndRef} />

                      </div>
                    )}

                  </div>

                  {/* MESSAGE INPUT */}

                  <form onSubmit={handleSendMessage} className="border-t border-slate-100 bg-white p-3 sm:p-4">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <input value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={sending} 
                        className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white sm:px-4"/>
                        <button type="submit"
                        disabled={sending || !message.trim()}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                            <Send size={19} />
                        </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}