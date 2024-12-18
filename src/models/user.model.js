import { Schema, model } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserRoles } from "../utils/common.js"

// *User schema
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    credits: {
      type: Number,
      default: 1,
      min: 0,
    },
    maxNoOfQuestions: {
      type: Number,
      default: 5,
      min: 5
    },
    role: {
      type: String,
      enum: UserRoles,
      default: "user",
    },
  },
  { timestamps: true }
)

// *Hash password
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next()

  this.password = bcrypt.hashSync(this.password, 10)
  next()
})

// *Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// *Generate access token
userSchema.methods.generateAccessToken = function () {
  const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = process.env

  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  )
}

// *Generate reset password token
userSchema.methods.generateResetPasswordToken = function () {
  const { RESET_PASSWORD_TOKEN_SECRET, RESET_PASSWORD_TOKEN_EXPIRY } =
    process.env

  return jwt.sign(
    {
      _id: this._id,
    },
    RESET_PASSWORD_TOKEN_SECRET,
    { expiresIn: RESET_PASSWORD_TOKEN_EXPIRY }
  )
}

// *User model
const User = model("User", userSchema)

export default User
