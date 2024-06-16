// require("dotenv").config({ path: "./env" });
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });

import app from "./src/app.js";

// import connectDB from "./src/db/index.js";
const port = process.env.PORT;

// connectDB()
  // .then(() => {
    app.listen(port || 8000, () => {
      console.log("Server is running at port : ", port);
    });
  // })
  // .catch((err) => {
    // console.log("Mongodb connection failed : ", err);
  // });
