import { body, validationResult } from "express-validator";
import { ApiErrors } from "../utils/ApiErrors.js";

// condition for new admin data
const validateNewAdminData = [
  body("adminName", "Enter a valid name").isLength({ min: 3 }),
  body("adminCode", "Enter a valid admin code").isNumeric().isInt(),
  body("work", "Enter the admins role in the school").exists(),
  body("email", "Enter a valid email").isEmail(),
  body(
    "password",
    "Enter a strong password of at least 8 - 15 characters"
  ).isLength({ min: 8, max: 15 }),
];
// condition for login admin data
const validateLoginAdminData = [
  body("userId", "Enter a valid adminCode").isNumeric().isInt(),
  body("email", "Enter a valid email").isEmail(),
  body("password", "password cannot be blank").exists(),
];

//adding the condition/type to the input fields for registration
const validateRegisteringUser = [
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body(
    "password",
    "Enter a strong password of at least 8 - 15 characters"
  ).isLength({ min: 8, max: 15 }),
];

//adding the condition/type to the input fields for login
const validateLoggingUser = [
  body("email", "Enter a valid email").isEmail(),
  body("password", "password cannot be blank").exists(),
];

//condition for new students entry
const validateNewTeacherData = [
  body("userName", "Enter a valid teacher name").isLength({ min: 3 }),
  body("userId", "Enter a valid teacherId").isNumeric().isInt(),
  body("subject", "Enter a valid subject name").exists(),
  body("contact", "Enter a valid contact number")
    .isMobilePhone()
    .isLength({ min: 10, max: 10 }),
];

//condition for new students entry
const validateNewStudentData = [
  body("userName", "Enter a valid student name").isLength({ min: 3 }),
  body("Class", "Enter a valid student class").isNumeric().isInt(),
  body("userId", "Enter a valid studentId").isNumeric().isInt(),
  body("DOB", "Enter a valid date of birth").isDate(),
  body("contact", "Enter a valid contact number")
    .isMobilePhone()
    .isLength({ min: 10, max: 10 }),
];

//adding the conditions for admission form filling
const validateAdmissionForm = [
  body("studentName", "Enter a valid student name").isLength({ min: 3 }),
  body("DOB", "Enter a valid date of birth").isDate(),
  body("gender", "Select a valid gender").isIn(["Male", "Female", "Other"]),
  body("address", "Enter a valid address").isLength({ min: 5 }),
  body("contactNumber", "Enter a valid contact number")
    .isMobilePhone()
    .isLength({ min: 10, max: 10 }),
  body("email", "Enter a valid email").isEmail(),
  body("guardianName", "Enter a valid guardian name").isLength({ min: 3 }),
  body("guardianContact", "Enter a valid guardian contact number")
    .isMobilePhone()
    .isLength({ min: 10, max: 10 }),
  body("previousSchool", "Enter a valid previous school name")
    .optional()
    .isLength({ min: 3 }),
  body("previousClass", "Enter a valid previous class")
    .optional()
    .isLength({ min: 1 }),
  body("desiredClass", "Enter a valid desired class").isLength({ min: 1 }),
  // body("previousClassMarkscard", "Add a file").notEmpty(),
];

// check for the validation error
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // if any errors found in validation send bad request
  if (!errors.isEmpty()) {
    const apiError = new ApiErrors(400, "Validation failed", errors.array());
    return res.status(apiError.statusCode).json({ errors: apiError.errors });
  }
  next();
};

export {
  validateNewAdminData,
  validateLoginAdminData,
  validateRegisteringUser,
  validateNewStudentData,
  validateNewTeacherData,
  validateLoggingUser,
  validateAdmissionForm,
  handleValidationErrors,
};
