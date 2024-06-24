import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getAllStudents } from "./controllers/student.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORES_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // telling server to understand the encoded data from an encoded url if the they are encoded
app.use(express.static("public")); //to save/store files or images in public folder
app.use(cookieParser()); //to access/set cookies from/in users browser

// routes import and declaration / available routes
import adminRouter from "./routes/admin.router.js";
app.use("/api/v1/admins", adminRouter);

import userRouter from "./routes/user.router.js";
app.use("/api/v1/users", userRouter);

import admissionRouter from "./routes/admission.router.js";
app.use("/api/v1/admissions", admissionRouter);

import teacherRouter from "./routes/teacher.routes.js";
app.use("/api/v1/teachers", teacherRouter);

import studentRouter from "./routes/student.router.js";
app.use("/api/v1/students", studentRouter);

app.get("/api/v1/reurnsuccess", (req, res) => {
  res.send("successfull");
});
app.get("/getAllStudents", getAllStudents);

app.get("/", (req, res) => {
  res.status(200).send("School Administration Runnding Successfully");
});

export default app;
