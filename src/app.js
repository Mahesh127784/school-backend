import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORES_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // telling server to understand the encoded data from an encoded url if the they are encoded
app.use(express.static("public")); //to save/store files or images i public folder
app.use(cookieParser()); //to access/set cookies from/in users browser

// routes import and declaration / available routes
import userRouter from "./routes/user.router.js";
app.use("/api/v1/users", userRouter);

import admissionRouter from "./routes/admission.router.js";
app.use("/api/v1/admission", admissionRouter);

export default app;
