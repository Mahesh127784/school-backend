import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema(
  {
    adminName: {
      type: String,
      required: true,
      index: true,
    },
    adminCode: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    work: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    adminImage: { type: String },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

//creating a salt password to original password and Hashing/encrypting password before saving in DB for safety
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// when admin login, check the password by this method
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//add a accesstoken and refresh token generator method to The model to run when user want to login and logout

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      adminName: this.adminName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
