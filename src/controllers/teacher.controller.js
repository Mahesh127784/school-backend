import { Teacher } from "../models/teacher.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const newTeacher = asyncHandler(async (req, res) => {
  // get data from req
  const { userName, userId, subject, contact } = req.body;

  //   check for teacher id availability
  const checkId = await Teacher.findOne({ teacherId: userId });

  if (checkId)
    throw new ApiErrors(
      400,
      `This teacherId is already aloted to ${checkId.subject} teacher mr/ms ${checkId.teacherName}`
    );

  //add teachers data in db
  await Teacher.create({
    teacherName: userName,
    teacherId: userId,
    subject,
    contactNumber: contact,
  });
  //   check for teachers creation
  const teacher = await Teacher.findOne({ teacherId: userId });

  if (!teacher)
    throw new ApiErrors(
      500,
      "Something went wrong while registering the teacher"
    );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        teacher,
        "teacher is registered successfully in the schools data"
      )
    );
});

const getAllTeachers = asyncHandler(async (req, res) => {
  let Teacher = [];
  for (let i = 1; i <= classes; i++) {
    const student = await Teacher.find({ Class: JSON.stringify(i) });
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
  const { userName, userId, subject, contact } = req.body;

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new ApiErrors(400, "Could not find the teachers data");

  const updatedTecher = await Teacher.findByIdAndUpdate(
    teacher._id,
    {
      $set: {
        teacherName: userName,
        teacherId: userId,
        subject,
        contactNumber: contact,
      },
    },
    { new: true }
  );
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        updatedTecher,
        "teachers data is updated successfully in the schools data"
      )
    );
});

const deleteData = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new ApiErrors(400, "Could not find the teachers data");

  //remove the teachers data
  await Teacher.findByIdAndDelete(teacher._id);

  //check for student removal
  const removedTeacher = await Teacher.findById(teacher._id);
  if (removedTeacher)
    throw new ApiErrors(
      500,
      "Something went wrong while removing the teachers data"
    );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        `Teacher ${teacher.teacherName}'s data is removed successfully from the school's data `
      )
    );
});

export { newTeacher, getAllTeachers, changeData, deleteData };
