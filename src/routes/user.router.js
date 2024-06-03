import { Router } from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
  changeCurrentPassword,
  getCurrentUser,
  userImage,
} from "../controllers/user.controller.js";

import { tokensRenewer } from "../utils/access&refreshtokens.js";

import {
  validateRegisteringUser,
  validateLoggingUser,
  handleValidationErrors,
} from "../middlewares/Validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//when registering user req
router
  .route("/register")
  .post(validateRegisteringUser, handleValidationErrors, registerUser);

//when loggin user reqz
router
  .route("/login")
  .post(validateLoggingUser, handleValidationErrors, loginUser);

//get the user after login to get their data
router.route("/getCurrentUser").post(verifyJWT, getCurrentUser);

//if access token expired
router.route("/tokensRenew").post(tokensRenewer);

//when logout user req
router.route("/logout").post(verifyJWT, logoutUser);

//when user want to change password
router.route("/changeCurrentPassword").put(verifyJWT, changeCurrentPassword);

//user adds profile pictures
router.route("/userImage").post(verifyJWT, upload.single("file"), userImage);

export default router;
