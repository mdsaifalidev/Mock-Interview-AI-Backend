import ApiError from "../utils/ApiError.js"

/**
 * @function errorHandler
 * @description Custom error handler
 * @returns {void}
 */
const errorHandler = (error, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  if (error instanceof ApiError) {
    return res
      .status(error.statusCode)
      .json({
        message: error.message,
        stack: isDevelopment ? error.stack : null,
      })
  } else {
    return res.status(500).json({
      message: "Something went wrong",
      stack: isDevelopment ? error.stack : null,
    })
  }
}

export default errorHandler
