import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    studentId: {
      type: Number,
      required: true,
      index: true,
    },
    class: {
      type: String,
      required: true,
      index: true,
    },
    DOB: {
      type: Number,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);
