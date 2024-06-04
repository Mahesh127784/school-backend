import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Student } from "../models/students.model.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AccessAndRefreshTokenGenerator } from "../utils/access&refreshtokens.js";
import { Admin } from "../models/admin.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //   get user datails from frontEnd
  const { name, userId, email, password } = req.body;

  //  check user is student/parent or teacher and are recognised in the schools data list by checking usersId
  const student = await Student.findOne({ studentId: userId });
  const teacher = await Teacher.findOne({
    teacherId: userId,
  });

  if (!student && !teacher)
    throw new ApiErrors(400, "You are not a registered member of our school");

  //  check weather someone trying to misUse teacher id and trying to register again using it
  if (teacher) {
    const check = await User.findOne({ userId });
    if (check)
      throw new ApiErrors(
        400,
        "This teacherId is already registred in our data"
      );
  }

  //   check user alredy exists using email
  const person = await User.findOne({ email });
  if (person)
    throw new ApiErrors(409, "This email is already registred in our data");

  //  create user's entry in db
  const user = await User.create({
    name,
    user: teacher ? "Teacher" : "Student",
    about: teacher ? teacher.subject : student.Class + ", " + student.section,
    userId,
    email,
    password,
    userImage:
      "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg",
  });

  //  check for user creation &  remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    throw new ApiErrors(500, "Something went wrong while registering the user");

  //  return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // find the user in the school Database
  const user = await User.findOne({ email });
  if (!user)
    throw new ApiErrors(
      400,
      "Invalid email or password,Please login with proper credentials"
    );

  //  check the user is added right password
  const checkPassword = await user.isPasswordCorrect(password);
  // if (!checkPassword)
  //   throw new ApiErrors(
  //     400,
  //     "Invalid email or password,Please login with proper credentials"
  //   );

  //  get the access and refresh tokens
  const { accessToken, refreshToken } = await AccessAndRefreshTokenGenerator(
    user
  );

  // prepare updatedUser data to send as Response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const message = "Logged in successfully";

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
        { user: loggedInUser, accessToken, refreshToken },
        message
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  (await req.user.user)
    ? User
    : Admin.findByIdAndUpdate(
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
    .json(new ApiResponse(200, {}, "User logged out"));
});

const userImage = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new ApiErrors(400, "Select an image to upload");
  }
  const userImage = `./public/temp/${file.filename}`;
  if (!userImage) {
    throw new ApiErrors(400, "No files added");
  }
  const picture = await uploadOnCloudinary(userImage);
  if (!picture) {
    throw new ApiErrors(400, "No files added");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        userImage: picture.secure_url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "Your image uploaded succcessfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // get the passwords from user
  const { currentPassword, newPassword } = req.body;

  if (newPassword.length < 8 || newPassword.length > 15)
    throw new ApiErrors(
      400,
      "Enter a strong password of at least 8 - 15 characters"
    );

  // find the loggedin user data
  const user = await User.findById(req.user?._id);

  const checkOldPassword = await user.isPasswordCorrect(currentPassword);

  if (!checkOldPassword) throw new ApiErrors(400, "Your password is incorrect");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed succesfully"));
});

const getCurrentUser = asyncHandler((req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  userImage,
};
