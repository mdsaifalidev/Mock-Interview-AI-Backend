import { body } from "express-validator"

const registerUserValidator = () => [
  body("fullName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Full name must be at least 3 characters long and at most 50 characters long"
    ),
  body("email").trim().escape().isEmail().withMessage("Invalid email address"),
  body("phone")
    .trim()
    .escape()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 6, max: 50 })
    .withMessage(
      "Password must be at least 6 characters long and at most 50 characters long"
    ),
]

const loginUserValidator = () => [
  body("email").trim().escape().isEmail().withMessage("Invalid email address"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 6, max: 50 })
    .withMessage(
      "Password must be at least 6 characters long and at most 50 characters long"
    ),
]

const forgotPasswordRequestValidator = () => [
  body("email").trim().escape().isEmail().withMessage("Invalid email address"),
]

const resetForgottenPasswordValidator = () => [
  body("newPassword")
    .trim()
    .escape()
    .isLength({ min: 6, max: 50 })
    .withMessage(
      "New password must be at least 6 characters long and at most 50 characters long"
    ),
]

export {
  registerUserValidator,
  loginUserValidator,
  forgotPasswordRequestValidator,
  resetForgottenPasswordValidator,
}
