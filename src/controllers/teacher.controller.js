import { Student } from "../models/students.model.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const newTeacher = asyncHandler(async (req, res) => {
  // get data from req
  const {
    firstName,
    lastName,
    email,
    address,
    DOB,
    university,
    degree,
    city,
    startDate,
    endDate,
    subject,
    contact,
    userId,
  } = req.body;

  //   check for teacher id availability
  const checkId1 = await Student.findOne({ studentId: userId });
  const checkId2 = await Teacher.findOne({ teacherId: userId });

  if (checkId1 || checkId2)
    throw new ApiErrors(
      400,
      (checkId1 &&
        `This teacherId is already aloted to ${checkId1.studentName} of class ${checkId1.Class}`) ||
        (checkId2 &&
          `This teacherId is already aloted to ${checkId2.subject} teacher mr/ms ${checkId2.teacherName}`)
    );

  //add teachers data in db
  await Teacher.create({
    teacherName: firstName + " " + lastName,
    teacherId: userId,
    email,
    address,
    DOB,
    university,
    degree,
    city,
    startDate,
    endDate,
    subject,
    contact,
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
  const subjects = [
    "Kannada",
    "English",
    "Hindi",
    "Mathamatics",
    "Science",
    "Social Science",
    "Physical Training",
    "Arts Education",
  ];

  let teachers = [];

  for (let i = 0; i < subjects.length; i++) {
    const teacher = await Teacher.find({ subject: subjects[i] });
    if (teacher[0]) {
      teachers = [...teachers, ...teacher];
    }
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, teachers, "Teachers  data fetched successfully")
    );
});

const changeData = asyncHandler(async (req, res) => {
  //get the details from req
  const {
    firstName,
    lastName,
    email,
    address,
    DOB,
    university,
    degree,
    city,
    startDate,
    endDate,
    subject,
    contact,
    userId,
  } = req.body;

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new ApiErrors(400, "Could not find the teachers data");

  //   check for teacher id availability
  const checkId1 = await Student.findOne({ studentId: userId });
  const checkId2 = await Teacher.findOne({ teacherId: userId });

  if (checkId1 || (checkId2 && teacher.teacherId !== Number(userId)))
    throw new ApiErrors(
      400,
      checkId1
        ? `This teacherId is already aloted to ${checkId1.studentName} of class ${checkId1.Class}`
        : `This teacherId is already aloted to ${checkId2.subject} teacher mr/ms ${checkId2.teacherName}`
    );

  const updatedTecher = await Teacher.findByIdAndUpdate(
    teacher._id,
    {
      $set: {
        teacherName: firstName + " " + lastName,
        teacherId: userId,
        email,
        address,
        DOB,
        university,
        degree,
        city,
        startDate,
        endDate,
        subject,
        contact,
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
