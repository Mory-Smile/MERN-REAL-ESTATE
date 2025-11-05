import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadRouter from "./routes/upload.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("DB error:", err))
  .catch((err) => {
    console.error(err);
  });

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["https://https://moraestate.vercel.app"],
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api", uploadRouter);
app.use("/api/listing", listingRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
