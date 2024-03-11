import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { ApiErrors } from "./ApiErrors.js";
import { asyncHandler } from "./asyncHandler.js";
import { ApiResponse } from "./ApiResponse.js";

// AccessAndRefreshTokenGenerator
const AccessAndRefreshTokenGenerator = async (userData) => {
  let user;
  user = await Admin.findById(userData._id);
  if (!user) user = await User.findById(userData._id);
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// AccessAndRefreshToken renewer
const tokensRenewer = asyncHandler(async (req, res) => {
  // get the refreshToken from the user

  const usersRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!usersRefreshToken) throw new ApiErrors(401, "unautherized request");

  //verify the user by jwt and get the user from db
  const decodedToken = jwt.verify(
    usersRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  let user;
  user = await User.findById(decodedToken?._id);
  if (!user) user = await Admin.findById(decodedToken?._id);

  if (!user) throw new ApiErrors(401, "Invalid refresh token");

  if (usersRefreshToken !== user?.refreshToken)
    throw new ApiErrors(401, "Refresh token is expired or been used");

  //create new tokens as the user is autherized
  const { accessToken, refreshToken } = await AccessAndRefreshTokenGenerator(
    user
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...options,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
});

export { AccessAndRefreshTokenGenerator, tokensRenewer };
