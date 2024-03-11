import { Router } from "express";
import {
  changeData,
  getAllStudents,
  deleteData,
  newStudent,
} from "../controllers/student.controller.js";
import {
  validateNewStudentData,
  handleValidationErrors,
} from "../middlewares/Validator.middleware.js";

const router = Router();

//register new student
router
  .route("/newStudent")
  .post(validateNewStudentData, handleValidationErrors, newStudent);

//get all students data
router.route("/getAllUsers").get(getAllStudents);

//change students data
router
  .route("/changeData/:id")
  .put(validateNewStudentData, handleValidationErrors, changeData);

//remove student
router.route("/deleteData/:id").delete(deleteData);

export default router;
