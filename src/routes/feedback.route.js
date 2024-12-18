import { Router } from "express"
import {
  createFeedback,
  getFeedbackById,
} from "../controllers/feedback.controller.js"
import { createFeedbackValidator, getFeedbackByIdValidator } from "../validators/feedback.validator.js"
import validate from "../middlewares/validate.middleware.js"

const router = Router()

router.post("/", createFeedbackValidator(), validate, createFeedback).get("/:id", getFeedbackByIdValidator(), validate, getFeedbackById)
export default router
