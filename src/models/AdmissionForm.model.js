import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const admissionFormSchema = new Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    guardianName: {
      type: String,
      required: true,
    },
    guardianContact: {
      type: String,
      required: true,
    },
    previousSchool: {
      type: String,
    },
    previousClass: {
      type: String,
    },
    desiredClass: {
      type: String,
      required: true,
    },
    previousClassMarkscard: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
admissionFormSchema.plugin(mongooseAggregatePaginate);

export const AdmissionForm = mongoose.model(
  "AdmissionForm",
  admissionFormSchema
);
