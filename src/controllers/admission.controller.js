import { AdmissionForm } from "../models/AdmissionForm.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    previousClass,
    desiredClass,
  } = req.body;

  console.log(req.files);

  //get the url of the file which is locally saved by multer
  const previousClassMarkscard = req.files.filename;
  // if (!previousClassMarkscard) throw new ApiErrors(400, "No files added");

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
    previousClass: previousClass || "",
    desiredClass,
    previousClassMarkscard: imageUrl,
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
      new ApiResponse(201, createdForm, "Application submited successfully")
    );
});

export { admissionSubmit };
