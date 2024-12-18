import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

/**
 * @function updateUserProfile
 * @description Update user profile
 * @access Private
 * @route PUT /api/v1/users/profile
 * @returns {Object}
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, phone } = req.body

  // *Check if user exists
  const user = await User.findById(req.user._id).select("fullName email phone")
  if (!user) {
    throw new ApiError(404, "User does not exists")
  }

  // *Check if email already exists
  const emailExists = await User.findOne({
    $and: [{ email }, { email: { $ne: user.email } }],
  })

  if (emailExists) {
    throw new ApiError(400, "Email already exists")
  }

  // *Check if phone number already exists
  const phoneExists = await User.findOne({
    $and: [{ phone }, { phone: { $ne: user.phone } }],
  });

  if (phoneExists) {
    throw new ApiError(400, "Phone number already exists")
  }

  user.fullName = fullName
  user.email = email
  user.phone = phone

  await user.save()

  res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", user))
})

/**
 * @function changePassword
 * @description Change password
 * @access Private
 * @route PUT /api/v1/users/change-password
 * @returns {Object}
 */
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  // *Check if user exists
  const user = await User.findById(req.user._id).select("password")
  if (!user) {
    throw new ApiError(404, "User does not exists")
  }

  // *Check if old password is correct
  const isPasswordValid = await user.isPasswordCorrect(oldPassword)
  if (!isPasswordValid) {
    throw new ApiError(400, "Old password is incorrect")
  }

  user.password = newPassword
  await user.save()

  res.status(200).json(new ApiResponse(200, "Password changed successfully"))
})

export { updateUserProfile, changePassword }
