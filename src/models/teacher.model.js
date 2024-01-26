import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    teacherName: {
      type: String,
      required: true,
      index: true,
    },
    teacherId: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      index: true,
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

export const Teacher = mongoose.model("Teacher", teacherSchema);
