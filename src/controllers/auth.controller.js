import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { cookieOptions } from "../utils/common.js"
import ms from "ms"
import jwt from "jsonwebtoken"
import { setDataToRedis, getDataFromRedis, deleteDataFromRedis } from "../utils/common.js"
import sendEmail from "../utils/mail.js"

/**
 * @function registerUser
 * @description Registers a user
 * @access Public
 * @route POST /api/v1/auth/register
 * @returns {Object}
 */
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body
  
  // *Check if email already exists
  const emailExists = await User.findOne({ email })

  if (emailExists) {
    throw new ApiError(400, "Email already exists")
  }

  // *Check if phone number already exists
  const phoneExists = await User.findOne({ phone })

  if (phoneExists) {
    throw new ApiError(400, "Phone number already exists")
  }

  // *Create user
  const user = await User.create({
    fullName,
    email,
    phone,
    password,
  })

  // *Generate access token
  const accessToken = user.generateAccessToken()

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY),
    })
    .json(new ApiResponse(201, "User registered successfully"))
})

/**
 * @function loginUser
 * @description Login a user
 * @access Public
 * @route POST /api/v1/auth/login
 * @returns {Object}
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // *Check if user exists
  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(401, "Invalid user credentials")
  }

  // *Check if password is correct
  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

  // *Generate access token
  const accessToken = user.generateAccessToken()

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY),
    })
    .json(new ApiResponse(200, "User logged in successfully"))
})

/**
 * @function logoutUser
 * @description Logout a user
 * @access Public
 * @route POST /api/v1/auth/logout
 * @returns {Object}
 */
const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, "User logged out successfully"))
})

/**
 * @function getCurrentUser
 * @description Get current user
 * @access Private
 * @route GET /api/v1/auth/current-user
 * @returns {Object}
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", req.user))
})

/**
 * @function forgotPasswordRequest
 * @description Forgot password request
 * @access Public
 * @route POST /api/v1/auth/forgot-password
 * @returns {Object}
 */
const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body

  // *Check if user exists
  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, "User does not exists")
  }

  // *Generate reset password token
  const resetPasswordToken = user.generateResetPasswordToken()

  // *Send email
  const isEmailSent = await sendEmail({
    email,
    subject: "Reset Your Password",
    message: `
      <p>Hi ${user.fullName},</p>
      <p>You have requested to reset your password. Click the link below to reset your password.</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}">Reset Password</a>
      <p>If you did not request to reset your password, please ignore this email. <b>This link will expire in 30 minutes.</b></p>
      <p>Thank you.</p>
    `,
  })

  if (!isEmailSent) {
    throw new ApiError(500, "Failed to send email")
  }

  // *Store reset token in redis
  await setDataToRedis(
    `resetPasswordToken:${user._id}`,
    resetPasswordToken,
    ms(process.env.RESET_PASSWORD_TOKEN_EXPIRY) / 1000
  )

  res
    .status(200)
    .json(new ApiResponse(200, "Reset password link sent successfully"))
})

/**
 * @function resetForgottenPassword
 * @description Reset forgotten password
 * @access Public
 * @route POST /api/v1/auth/reset-password/:resetPasswordToken
 * @returns {Object}
 */
const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params
  const { newPassword } = req.body

  try {
    // *Verify reset password token
    const decode = jwt.verify(
      resetPasswordToken,
      process.env.RESET_PASSWORD_TOKEN_SECRET
    )
    const cacheKey = `resetPasswordToken:${decode._id}`

    // *Get reset token from redis
    const storedResetPasswordToken = await getDataFromRedis(cacheKey)

    if (storedResetPasswordToken !== resetPasswordToken) {
      throw new ApiError(401, "Unauthorized request")
    }

    // *Get user
    const user = await User.findById(decode._id)

    if (!user) {
      throw new ApiError(401, "Unauthorized request")
    }

    // *Update password
    user.password = newPassword
    await user.save()

    // *Delete reset token from redis
    await deleteDataFromRedis(cacheKey)

    res.status(200).json(new ApiResponse(200, "Password reset successfully"))
  } catch (error) {
    throw new ApiError(401, "Unauthorized request")
  }
})

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPasswordRequest,
  resetForgottenPassword,
}
