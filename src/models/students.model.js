import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    studentName: {
      type: String,
      required: true,
      index: true,
    },
    studentId: {
      type: Number,
      required: true,
      index: true,
    },
    Class: {
      type: String,
      required: true,
      index: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    parentContact: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);
