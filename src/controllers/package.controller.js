import asyncHandler from "express-async-handler"
import Package from "../models/package.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import { getDataFromRedis, setDataToRedis } from "../utils/common.js"

/**
 * @function getAllPackages
 * @description Get all packages
 * @access Private
 * @route GET /api/v1/packages
 * @returns {Object}
 */
const getAllPackages = asyncHandler(async (req, res) => {
  const cacheKey = "packages"
  // *get packages from redis
  const cachedPackages = await getDataFromRedis(cacheKey)
  if (cachedPackages) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Packages fetched successfully", cachedPackages)
      )
  }

  // *Get all packages
  const packages = await Package.find({}).sort({ price: 1 })

  // *Cache packages
  await setDataToRedis(cacheKey, packages, 60 * 60 * 24) // 24 hours

  res
    .status(200)
    .json(new ApiResponse(200, "Packages fetched successfully", packages))
})

export { getAllPackages }
