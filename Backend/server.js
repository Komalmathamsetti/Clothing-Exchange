require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const pool = require("./config/db");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  // ----------------------------------------
  // Join user's personal room
  // ----------------------------------------
  socket.on("join_user", (userId) => {
    if (!userId) {
      return;
    }

    socket.join(`user_${userId}`);
  });

  // ----------------------------------------
  // Join chat room
  // ----------------------------------------
  socket.on("join_chat", (chatId) => {
    if (!chatId) {
      return;
    }

    socket.join(`chat_${chatId}`);
  });

  // ----------------------------------------
  // Disconnect
  // ----------------------------------------
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
async function startServer() {
  try {
    await pool.connect();
    console.log("Database Connected Successfully");
    server.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
startServer();
