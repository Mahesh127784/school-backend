import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  console.log(uri);
  let connention = await mongoose
    .connect(`${uri}/${DB_NAME}`)
    .then(() => {
      console.log("connected to mongoDB successfully !! ");
    })
    .catch((err) => {
      console.log("error in mongodb connection : " + err);
      process.exit(1);
      //process is nodejs feature,to stop the code if data base doesnt connect we use one of exit method
    });
};

export default connectDB;
