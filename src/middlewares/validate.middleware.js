import { validationResult } from "express-validator"
import asyncHandler from "express-async-handler"
import ApiError from "../utils/ApiError.js"

/**
 * @function validate
 * @description Validate request body
 * @returns {void}
 */
const validate = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg)
  }
  next()
})

export default validate
