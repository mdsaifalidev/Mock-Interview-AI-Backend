import { Router } from "express"
import {
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetForgottenPassword,
} from "../controllers/auth.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import {
  registerUserValidator,
  loginUserValidator,
  forgotPasswordRequestValidator,
  resetForgottenPasswordValidator,
} from "../validators/auth.validator.js"
import validate from "../middlewares/validate.middleware.js"
import verifyReCaptcha from "../middlewares/reCaptcha.middleware.js"

const router = Router()

router
  .post(
    "/register",
    registerUserValidator(),
    validate,
    verifyReCaptcha,
    registerUser
  )
  .post("/login", loginUserValidator(), validate, verifyReCaptcha, loginUser)
  .post("/logout", verifyJWT, logoutUser)
  .get("/current-user", verifyJWT, getCurrentUser)
  .post(
    "/forgot-password",
    forgotPasswordRequestValidator(),
    validate,
    verifyReCaptcha,
    forgotPasswordRequest
  )
  .post(
    "/reset-password/:resetPasswordToken",
    resetForgottenPasswordValidator(),
    validate,
    verifyReCaptcha,
    resetForgottenPassword
  )

export default router
