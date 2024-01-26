import { Admin } from "../models/admin.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AccessAndRefreshTokenGenerator } from "../utils/access&refreshtokens.js";

const newAdmin = asyncHandler(async (req, res) => {
  //get data from the req
  const { adminName, adminCode, email, password } = req.body;

  //check weather adminID and email is already aloted
  const adminC1 = await Admin.findOne({ adminCode });
  const adminC2 = await Admin.findOne({ email });

  if (adminC1 || adminC2)
    throw new ApiErrors(400, "adminId or email is already in use for a admin");

  //  create admin's entry in db
  const admin = await Admin.create({
    adminName,
    adminCode,
    email,
    password,
  });

  //check for admin creation &  remove password and refresh token field from response
  const createdAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );
  if (!createdAdmin)
    throw new ApiErrors(
      500,
      "Something went wrong while registering the admin"
    );

  //  return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdAdmin, "Admin registered successfully"));
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, adminCode, password } = req.body;

  //find the admin data in admins DB
  const admin = await Admin.findOne({ email, adminCode });

  if (!admin) {
    throw new ApiErrors(400, "Please login with proper credentials");
  }

  //check for the password
  const checkPassword = await admin.isPasswordCorrect(password);
  if (!checkPassword)
    throw new ApiErrors(400, "Please login with proper credentials");

  const { accessToken, refreshToken } = await AccessAndRefreshTokenGenerator(
    admin
  );

  // prepare updatedAdmin data to send as Response
  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );
  // some settings for cookies security
  const options = {
    httpOnly: true,
    security: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { admin: loggedInAdmin, accessToken, refreshToken },
        "Admin logged in successfully"
      )
    );
});

const getCurrentAdmin = asyncHandler((req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current Admin fetched successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },

    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "Admin logged out"));
});

export { newAdmin, adminLogin, getCurrentAdmin, logoutAdmin };
