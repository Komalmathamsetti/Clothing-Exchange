const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const clothingRoutes = require("./routes/clothingRoutes");
const swapRoutes = require("./routes/swapRoutes");
const chatRoutes = require("./routes/chatRoutes");
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/clothing",clothingRoutes);
app.use("/api/swaps",swapRoutes);
app.use("/api/chats",chatRoutes);
app.get("/",(req,res)=>{
   res.status(200).json({
    success:true,
    message:"Clothing Exchange API is running"
   });
});
module.exports = app;