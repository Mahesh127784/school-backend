import { Router } from "express";
import {
  handleValidationErrors,
  validateNewTeacherData,
} from "../middlewares/Validator.middleware.js";
import {
  changeData,
  deleteData,
  getAllTeachers,
  newTeacher,
} from "../controllers/teacher.controller.js";

const router = Router();

router
  .route("/newTeacher")
  .post(validateNewTeacherData, handleValidationErrors, newTeacher);

//get all teachers data
router.route("/getAllTeachers").get(getAllTeachers);

//change teachers data
router
  .route("/changeData/:id")
  .put(validateNewTeacherData, handleValidationErrors, changeData);

//remove teacher
router.route("/deleteData/:id").delete(deleteData);

export default router;
