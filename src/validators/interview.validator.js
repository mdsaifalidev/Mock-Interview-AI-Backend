import { body, param } from "express-validator"
import { DifficultyLevels, NoOfQuestions } from "../utils/common.js"

const createInterviewValidator = () => [
  body("jobRole")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Job role is required")
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Job role must be at least 3 characters long and at most 50 characters long"
    ),
  body("jobDescription")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "Job description must be at least 3 characters long and at most 100 characters long"
    ),
  body("jobExperience")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Job experience is required")
    .isInt({ min: 0, max: 30 })
    .withMessage("Job experience must be between 0 and 30"),
  body("noOfQuestions")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Number of questions is required")
    .isInt()
    .withMessage("Number of questions must be an integer")
    .isIn(NoOfQuestions)
    .withMessage("Invalid number of questions"),
  body("difficulty")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(DifficultyLevels)
    .withMessage("Invalid difficulty level"),
]

const getInterviewByIdValidator = () => [
  param("id").isMongoId().withMessage("Invalid interview id"),
]

const endInterviewValidator = () => [
  param("id").isMongoId().withMessage("Invalid interview id"),
]

export { createInterviewValidator, getInterviewByIdValidator, endInterviewValidator }
