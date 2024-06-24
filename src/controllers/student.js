import { Student } from "../models/students.model.js";

export const getAllStudents = async (req, res) => {
  try {
    const student = await Student.find();
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
