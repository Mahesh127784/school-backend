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
  body("firstName", "First name must be at least 3 characters long").isLength({
    min: 3,
  }),
  body("lastName", "Last name must be at least 3 characters long").isLength({
    min: 3,
  }),
  body("email", "Enter a valid email address").isEmail(),
  body("contact", "Enter a valid contact number")
    .isMobilePhone()
    .isLength({ min: 10, max: 10 }),
  body("address", "Address cannot be empty").notEmpty(),
  body("DOB", "Enter a valid date of birth").isDate(),
  body("subject", "Subject cannot be empty").notEmpty(),
  body(
    "university",
    "University name must be at least 3 characters long"
  ).isLength({ min: 3 }),
  body("degree", "Degree cannot be empty").notEmpty(),
  body("city", "City cannot be empty").notEmpty(),
  body("startDate", "Enter a valid start date").isDate(),
  body("endDate", "Enter a valid end date").isDate(),
  body("userId", "Enter a valid Roll Number").isNumeric().isInt(),
];

//condition for new students entry
const validateNewStudentData = [
  body("firstName", "First name must be at least 3 characters long").isLength({
    min: 3,
  }),
  body("lastName", "Last name must be at least 3 characters long").isLength({
    min: 3,
  }),
  body("address", "Address cannot be empty").notEmpty(),
  body("DOB", "Enter a valid date of birth").isDate(),
  body(
    "guardianName",
    "Guardian name must be at least 3 characters long"
  ).isLength({ min: 3 }),
  body("guardianPhone", "Enter a valid guardian phone number")
    .isMobilePhone()
    .isLength({ min: 10, max: 10 }),
  body("enrollmentDate", "Enter a valid enrollment date").isDate(),
  body("Class", "Grade cannot be empty").notEmpty(),
  body("section", "Section cannot be empty").notEmpty(),
  body("userId", "Enter a valid Roll Number").isNumeric().isInt(),
];

//adding the conditions for admission form filling
const validateAdmissionForm = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name should only contain letters"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name should only contain letters"),

  body("DOB")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isDate()
    .withMessage("Date of birth must be a valid date"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be either male, female, or other"),

  body("address").notEmpty().withMessage("Address is required"),

  body("contactNumber")
    .notEmpty()
    .withMessage("Contact number is required")
    .isMobilePhone()
    .withMessage("Contact number must be a valid phone number"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),

  body("guardianName")
    .notEmpty()
    .withMessage("Guardian name is required")
    .isAlpha(" ")
    .withMessage("Guardian name should only contain letters and spaces"),

  body("guardianContact")
    .notEmpty()
    .withMessage("Guardian contact is required")
    .isMobilePhone()
    .withMessage("Guardian contact must be a valid phone number"),

  body("previousSchool").notEmpty().withMessage("Previous school is required"),

  body("desiredClass")
    .notEmpty()
    .withMessage("Desired class is required")
    .isInt()
    .withMessage("Desired class must be a valid class number"),

  body("file").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("File is required");
    }
    return true;
  }),
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
