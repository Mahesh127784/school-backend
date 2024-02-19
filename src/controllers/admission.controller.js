import { AdmissionForm } from "../models/AdmissionForm.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const admissionSubmit = asyncHandler(async (req, res) => {
  //get the details from req
  const {
    studentName,
    DOB,
    gender,
    address,
    contactNumber,
    email,
    guardianName,
    guardianContact,
    previousSchool,
    desiredClass,
  } = req.body;

  console.log(req.body);
  console.log(req.file);
  //get the url of the file which is locally saved by multer
  const file = req.file;
  const previousClassMarkscard = `./public/temp/${file.filename}`;

  if (!previousClassMarkscard) throw new ApiErrors(400, "No files added");

  //upload the file to cloudinary
  const marksCard = await uploadOnCloudinary(previousClassMarkscard);
  if (!marksCard) throw new ApiErrors(400, "No files added");

  // add the form in db
  const admissionForm = new AdmissionForm({
    studentName,
    DOB,
    gender,
    address,
    contactNumber,
    email,
    guardianName,
    guardianContact,
    previousSchool: previousSchool || "",
    desiredClass,
    previousClassMarkscard: marksCard.secure_url,
  });
  await admissionForm.save();

  //check if the form is saved or not in the db
  const createdForm = await AdmissionForm.findById(admissionForm._id);
  if (!createdForm)
    throw new ApiErrors(
      500,
      "Something went wrong while submitting the application"
    );

  // return the response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdForm,
        "Your application submited successfully"
      )
    );
});

export { admissionSubmit };
