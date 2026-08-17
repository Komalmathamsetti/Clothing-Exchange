const express = require("express");
const router = express.Router();
const { createChat,getMyChats,getChatMessages,sendMessage } = require("../controllers/chatController");
const { verifyToken } = require("../middleware/authMiddleware");
router.post("/",verifyToken,createChat);
router.get("/",verifyToken,getMyChats);
router.get("/:chatId/messages",verifyToken,getChatMessages);
router.post("/:chatId/messages",verifyToken,sendMessage);
module.exports = router;