import asyncHandler from "express-async-handler"
import ApiError from "../utils/ApiError.js"
import axios from "axios"

/**
 * @function verifyReCaptcha
 * @description Verify reCaptcha
 * @returns {void}
 */
const verifyReCaptcha = asyncHandler(async (req, res, next) => {
  const { reCaptcha } = req.body

  if (!reCaptcha) {
    throw new ApiError(400, "reCaptcha is required")
  }

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${reCaptcha}`
  const {data} = await axios.post(url)

  if (!data.success) {
    throw new ApiError(400, "reCaptcha verification failed")
  }

  next()
})

export default verifyReCaptcha
