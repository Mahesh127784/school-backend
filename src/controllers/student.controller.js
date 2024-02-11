import { asyncHandler } from "../utils/asyncHandler.js";
import { Student } from "../models/students.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const newStudent = asyncHandler(async (req, res) => {
  //get the details from req
  const { userName, userId, Class, DOB, contact } = req.body;

  //   check if the student id is already aloted
  const checkId = await Student.findOne({ studentId: userId });
  if (checkId)
    throw new ApiErrors(
      400,
      `This studentId is already aloted to ${checkId.studentName} of class ${checkId.Class}`
    );

  //add the students data in DB
  await Student.create({
    studentName: userName,
    studentId: userId,
    Class,
    DOB,
    parentContact: contact,
  });

  //check for student creation
  const student = await Student.findOne({ studentId: userId });
  if (!student)
    throw new ApiErrors(
      500,
      "Something went wrong while registering the student"
    );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        student,
        "student is registered successfully in the schools data"
      )
    );
});

const getAllStudents = asyncHandler(async (req, res) => {
  const classes = 20;
  let students = [];
  for (let i = 1; i <= classes; i++) {
    const student = await Student.find({ Class: JSON.stringify(i) });
    if (student[0]) {
      students = [...students, ...student];
    }
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, students, "Students  data fetched successfully")
    );
});

const changeData = asyncHandler(async (req, res) => {
  //get the details from req
  const { userName, userId, Class, DOB, contact } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiErrors(400, "Could not find the Students data");

  const updatedStudent = await Student.findByIdAndUpdate(
    student._id,
    {
      $set: {
        studentName: userName,
        studentId: userId,
        Class,
        DOB,
        parentContact: contact,
      },
    },
    { new: true }
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        updatedStudent,
        "student data is updated successfully in the schools data"
      )
    );
});

const deleteData = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiErrors(404, "Could not find the students data");

  //remove the students data
  await Student.findByIdAndDelete(student._id);

  //check for student removal
  const removedStudent = await Student.findById(student._id);

  if (removedStudent)
    throw new ApiErrors(
      500,
      "Something went wrong while removing the students data"
    );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        `${student.studentName}'s data is removed successfully from the school's data `
      )
    );
});

export { newStudent, getAllStudents, changeData, deleteData };
