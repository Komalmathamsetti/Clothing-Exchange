const pool = require("../config/db");
exports.createChat = async(req,res)=>{
    try{
      const { swap_request_id } = req.body;
      if(!swap_request_id){
        return res.status(400).json({
            success:false,
            message:"Swap request id is required"
        });
      }
      const exisitingChat = await pool.query(
        `SELECT id 
        FROM chats
        WHERE swaps_request_id = $1`,[swap_request_id]
      );
      if(exisitingChat.rows.length > 0){
        return res.status(200).json({
            success:true,
            message:"Chat already exists",
            chat:exisitingChat.rows[0]
        });
      }
      const result = await pool.query(
        `INSERT INTO chats (swap_request_id)
        VALUES ($1)
        RETURNING *`,[swap_request_id]
      );
      res.status(201).json({
        success:true,
        message:"Chat created successfully",
        chat: result.rows[0]
      });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};
exports.getMyChats = async(req,res)=>{
    try{
      const userId = req.user.id;
      const result = await pool.query(
        `SELECT c.id AS chat_id,
        c.swap_request_id,
        c.created_at,
        sr.sender_id,
        sr.reciever_id,
        sr.sender_item_id,
        sr.reciever_item_id,
        sr.status AS swap_status
        sender.full_name AS sender_name,
        reciever.full_name AS reciever_name,
        sender.item_title AS sender_item_title,
        reciever.item_title AS reciever_item_title,
        (
          SELECT m.message
          FROM messages m
          WHERE m.chat_id = c.id,
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_message,
        (
          SELECT m.created_at
          FROM messages m
          WHERE m.chat_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_message_at
         FROM chats c 
         INNER JOIN swap_request sr 
         ON c.swap_request_id = sr.id
         INNER JOIN users sender
        ON sr.sender_id = sender.id
        INNER JOIN users receiver
        ON sr.receiver_id = receiver.id
        LEFT JOIN clothing_items sender_item
        ON sr.sender_item_id = sender_item.id
        LEFT JOIN clothing_items receiver_item
        ON sr.receiver_item_id = receiver_item.id
        WHERE sr.sender_id = $1
         OR sr.receiver_id = $1
        ORDER BY COALESCE(
        (
          SELECT m.created_at
          FROM messages m
          WHERE m.chat_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ),
        c.created_at
      ) DESC`,[userId]
      );
      res.status(200).json({
        success:true,
        chats:result.rows,
        count:result.rows.length
      });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Make sure user belongs to this swap
    const chatCheck = await pool.query(
      `
      SELECT c.id
      FROM chats c
      INNER JOIN swap_requests sr
        ON c.swap_request_id = sr.id
      WHERE c.id = $1
        AND (
          sr.sender_id = $2
          OR sr.receiver_id = $2
        )
      `,
      [chatId, userId]
    );

    if (chatCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this chat",
      });
    }

    const result = await pool.query(
      `
      SELECT
        m.id,
        m.chat_id,
        m.sender_id,
        m.message,
        m.created_at,
        u.full_name AS sender_name
      FROM messages m

      INNER JOIN users u
        ON m.sender_id = u.id

      WHERE m.chat_id = $1

      ORDER BY m.created_at ASC
      `,
      [chatId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      messages: result.rows,
    });
  } catch (error) {
    console.error("GET CHAT MESSAGES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    const senderId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Verify user belongs to chat
    const chatCheck = await pool.query(
      `
      SELECT c.id
      FROM chats c
      INNER JOIN swap_requests sr
        ON c.swap_request_id = sr.id
      WHERE c.id = $1
        AND (
          sr.sender_id = $2
          OR sr.receiver_id = $2
        )
      `,
      [chatId, senderId]
    );

    if (chatCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this chat",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO messages
      (
        chat_id,
        sender_id,
        message
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        chatId,
        senderId,
        message.trim(),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};