import { Router } from "express";
import {
  newAdmin,
  adminLogin,
  logoutAdmin,
  getCurrentAdmin,
} from "../controllers/admin.controller.js";
import {
  validateNewAdminData,
  validateLoginAdminData,
  handleValidationErrors,
} from "../middlewares/Validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { tokensRenewer } from "../utils/access&refreshtokens.js";

const router = Router();

//when registering admin req
router
  .route("/newAdmin")
  .post(validateNewAdminData, handleValidationErrors, newAdmin);

//when loggin admin req
router
  .route("/adminLogin")
  .post(validateLoginAdminData, handleValidationErrors, adminLogin);

//get the admin after login to get their data
router.route("/getCurrentAdmin").post(verifyJWT, getCurrentAdmin);

//if access token expired
router.route("/tokensRenew").post(tokensRenewer);

//when logout admin req
router.route("/adminLogout").post(verifyJWT, logoutAdmin);

export default router;
