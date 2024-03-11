import { Router } from "express";
import {
  validateAdmissionForm,
  handleValidationErrors,
} from "../middlewares/Validator.middleware.js";
import { admissionSubmit } from "../controllers/admission.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/admission-form")
  .post(
    validateAdmissionForm,
    handleValidationErrors,
    upload.single("file"),
    admissionSubmit
  );

export default router;
