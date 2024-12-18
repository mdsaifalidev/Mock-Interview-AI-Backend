import { body, query, param } from "express-validator"

const createFeedbackValidator = () => [
  query("interviewId").isMongoId().withMessage("Invalid interview id"),
  query("questionId").isMongoId().withMessage("Invalid question id"),
  body("question")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Question is required")
    .isLength({ min: 3, max: 500 })
    .withMessage(
      "Question must be at least 3 characters long and at most 500 characters long"
    ),
  body("userAnswer")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("User answer is required")
    .isLength({ min: 3, max: 500 })
    .withMessage(
      "User answer must be at least 3 characters long and at most 500 characters long"
    ),
]

const getFeedbackByIdValidator = () => [
  param("id").isMongoId().withMessage("Invalid interview id"),
]

export { createFeedbackValidator, getFeedbackByIdValidator }
