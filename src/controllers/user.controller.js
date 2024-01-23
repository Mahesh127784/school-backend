import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Student } from "../models/students.model.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// AccessAndRefreshTokenGenerator
const AccessAndRefreshTokenGenerator = async (id) => {
  try {
    const user = await User.findById(id);
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

const registerUser = asyncHandler(async (req, res) => {
  //   get user datails from frontEnd
  const { name, userId, email, password } = req.body;

  //check user is student/parent or teacher and are recognised in the schools data list by checking usersId
  const student = await Student.findOne({ studentId: userId });
  const teacher = await Teacher.findOne({
    teacherId: userId,
  });

  if (!student && !teacher)
    throw new ApiErrors(400, "You are not a registered member of our school");

  //check weather someone trying to misUse teacher id and trying to register again using it
  if (teacher) {
    const check = await User.findOne({ userId });
    if (check) throw new ApiErrors(400, "This teacherId is already in use");
  }

  //   check user alredy exists using email
  const person = await User.findOne({ email });
  if (person) throw new ApiErrors(409, "This email is already in use");

  //  create user's entry in db
  const user = await User.create({
    name,
    userId,
    email,
    password,
  });

  //check for user creation &  remove password and refresh token field from response
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

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // find the user in the school Database
  const user = await User.findOne({ email });
  if (!user)
    throw new ApiErrors(
      400,
      "Invalid email or password,Please login with proper credentials"
    );

  //check the user is added right password
  const checkPassword = await user.isPasswordCorrect(password);
  // console.log(checkPassword);
  if (!checkPassword)
    throw new ApiErrors(
      400,
      "Invalid email or password,Please login with proper credentials"
    );

  const { accessToken, refreshToken } = await AccessAndRefreshTokenGenerator(
    user._id
  );

  // prepare updatedUser data to send as Response
  const loggedInUser = await User.findById(user._id).select(
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
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
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

const tokensRenewer = asyncHandler(async (req, res) => {
  // get the refreshToken from the user
  const usersRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!usersRefreshToken) throw new ApiErrors(401, "unautherized request");

  //verify the user by jwt and get the user from db
  const decodedToken = jwt.verify(
    usersRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) throw new ApiErrors(401, "Invalid refresh token");
  if (usersRefreshToken !== user?.refreshToken)
    throw new ApiErrors(401, "Refresh token is expired or been used");

  //create new tokens as the user is autherized
  const { accessToken, refreshToken } = await AccessAndRefreshTokenGenerator(
    user._id
  );

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
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
});

export { registerUser, loginUser, logoutUser, tokensRenewer };
