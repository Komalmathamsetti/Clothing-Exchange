const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.get("/",(req,res)=>{
   res.status(200).json({
    success:true,
    message:"Clothing Exchange API is running"
   });
});
module.exports = app;