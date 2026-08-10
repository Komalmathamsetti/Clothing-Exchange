const pool = require("../config/db");
exports.createSwapRequest = async(req,res)=>{
    try{
      const senderId = req.user.id;
      const {
        reciever_id,
        sender_item_id,
        reciever_item_id,
        message
      } = req.body;
      if(!reciever_id || !sender_item_id || !reciever_item_id){
        return res.status(400).json({
            success:false,
            message:"receiver_id, sender_item_id and receiver_item_id are required"
        });
      }
      if(Number(senderId) === Number(reciever_id)){
        return res.status(400).json({
            success:false,
            message:"You cannot send a swap request to yourself"
        });
      }
      
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};