import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    teacherName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
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
    address: {
      type: String,
      required: true,
      index: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Teacher = mongoose.model("Teacher", teacherSchema);
