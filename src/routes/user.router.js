import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  tokensRenewer,
} from "../controllers/user.controller.js";
import {
  validateRegisteringUser,
  validateLoggingUser,
  handleValidationErrors,
} from "../middlewares/Validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//when registering user req
router
  .route("/register")
  .post(validateRegisteringUser, handleValidationErrors, registerUser);

//when loggin user req
router
  .route("/login")
  .post(validateLoggingUser, handleValidationErrors, loginUser);

//if access token expired
router.route("/tokensRenew").post(tokensRenewer);

//when logout user req
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
