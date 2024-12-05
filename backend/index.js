import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes.js";

// Load environemnt variable
dotenv.config();

// connect to mongodb
connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"], // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent/received
  })
);
app.use(express.json());
app.use(cookieParser());

// logger middleware to see all the details of the request that is coming
// app.use((req,next) =>{
//     req.time = new Date(Date.now()).toString();
//     console.log(req.method,req.hostname, req.path, req.time);
//     next();
// });

app.use("/api/auth", router);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
