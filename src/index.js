// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
dotenv.config({ path: "./env" });

import express from "express";
const app = express.connect;
import connectDB from "./db/index.js";

connectDB();
const port = process.env.PORT;

/* not a proffession way to coonect database in starting page
import mongoose from "mongoose";
import { DB_NAME } from "./constants";

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.listen(port, () => {
      console.log("Your app is listening on port " + port);
    });
  } catch (error) {
    console.log("error: " + error);
  }
})(); */

// app.listening(port, () => {
//   console.log("Your app is listening on port " + port);
// });
