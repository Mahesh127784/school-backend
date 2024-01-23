import jsw from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Access the token from the request
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");
  if (!token) throw new ApiErrors(401, "Unautherized request");

  // verify the Accesstoken with our Accesstoken secret to get the data of the user we added in it
  const verifiedUser = jsw.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(verifiedUser?._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiErrors(401, "Invalid accessToken");

  //adding the userDetails object to request so that use it when we need
  req.user = user;
  next();
});
