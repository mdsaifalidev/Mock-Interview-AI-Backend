import { body } from "express-validator"

const updateUserProfileValidator = () => [
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
]

const changePasswordValidator = () => [
  body("oldPassword")
    .trim()
    .escape()
    .isLength({ min: 6, max: 50 })
    .withMessage(
      "Old Password must be at least 6 characters long and at most 50 characters long"
    ),
  body("newPassword")
    .trim()
    .escape()
    .isLength({ min: 6, max: 50 })
    .withMessage(
      "New Password must be at least 6 characters long and at most 50 characters long"
    ),
]

export {
  updateUserProfileValidator,
  changePasswordValidator
}