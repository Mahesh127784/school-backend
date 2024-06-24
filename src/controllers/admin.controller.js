import { Admin } from "../models/admin.model.js";
// import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AccessAndRefreshTokenGenerator } from "../utils/access&refreshtokens.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import { ApiErrors } from "../utils/ApiErrors.js";

const newAdmin = asyncHandler(async (req, res) => {
  //get data from the req
  const { adminName, adminCode, work, email, password } = req.body;
  //check weather adminID and email is already aloted
  const adminC1 = await Admin.findOne({ adminCode });
  if (adminC1)
    throw new ApiErrors(400, "admin code is already in use for a admin");
  const adminC2 = await Admin.findOne({ email });
  if (adminC2) throw new ApiErrors(400, "email is already in use for a admin");

  //  create admin's entry in db
  const admin = await Admin.create({
    adminName,
    adminCode,
    work,
    email,
    password,
    adminImage:
      "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg",
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

const getAllAdmins = asyncHandler(async (req, res) => {
  const works = [
    "Principal",
    "Voice Principal",
    "Teacher",
    "Student Leader",
    "Clerk",
    "School President",
    "School Assembly Member",
  ];
  let admins = [];
  for (let i = 0; i < works.length; i++) {
    const admin = await Admin.find({ work: works[i] });
    if (admin[0]) {
      admins.push(...admin);
    }
  }

  res
    .status(201)
    .json(new ApiResponse(201, admins, "Admins  data fetched successfully"));
});

const changeData = asyncHandler(async (req, res) => {
  //get the details from req
  const { adminName, work, adminCode, email, password } = req.body;

  const admin = await Admin.findById(req.params.id);
  if (!admin) throw new ApiErrors(400, "Could not find the admin data");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const updatedAdmin = await Admin.findByIdAndUpdate(
    admin._id,
    {
      $set: {
        adminName,
        adminCode,
        work,
        email,
        password: hashedPassword,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        updatedAdmin,
        "admin's data is updated successfully in the schools data"
      )
    );
});

const deleteData = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) throw new ApiErrors(400, "Could not find the admin data");

  //remove the admin data
  await Admin.findByIdAndDelete(admin._id);

  //check for admin removal
  const removedAdmin = await Admin.findById(admin._id);

  if (removedAdmin)
    throw new ApiErrors(
      500,
      "Something went wrong while removing the admins data"
    );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        `${admin.adminName}'s data is removed successfully from the school's data `
      )
    );
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, userId, password } = req.body;

  //find the admin data in admins DB
  const admin = await Admin.findOne({ email, adminCode: userId });

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
        { admin: loggedInAdmin, accessToken, refreshToken },
        "Admin logged in successfully"
      )
    );
});

const adminImage = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new ApiErrors(400, "Select an image to upload");
  }
  const adminImage = `./public/temp/${file.filename}`;
  if (!adminImage) {
    throw new ApiErrors(400, "No files added");
  }
  const picture = await uploadOnCloudinary(adminImage);
  if (!picture) {
    throw new ApiErrors(400, "No files added");
  }

  const user = await Admin.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        adminImage: picture.secure_url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "Your image uploaded succcessfully"));
});

// const logoutAdmin = asyncHandler(async (req, res) => {
//   await Admin.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: { refreshToken: undefined },
//     },

//     { new: true }
//   );
//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .clearCookie("refreshToken", options)
//     .clearCookie("accessToken", options)
//     .json(new ApiResponse(200, {}, "Admin logged out"));
// });

export {
  newAdmin,
  changeData,
  deleteData,
  getAllAdmins,
  adminLogin,
  adminImage,
  // logoutAdmin,
};
