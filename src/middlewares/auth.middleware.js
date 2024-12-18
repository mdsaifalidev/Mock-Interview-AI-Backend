import asyncHandler from "express-async-handler"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

/**
 * @function verifyJWT
 * @description Verifies the JWT token
 * @returns {void}
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken

    if(!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        // *Verify the token
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // *Get the user
        const user = await User.findById(decode._id).select("-password")

        if(!user) {
            throw new ApiError(401, "Unauthorized request")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Unauthorized request")
    }
})

export default verifyJWT