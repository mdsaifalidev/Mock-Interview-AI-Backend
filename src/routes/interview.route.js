import { Router } from "express"
import {
  createInterview,
  endInterview,
  getAllInterviews,
  getInterviewById,
} from "../controllers/interview.controller.js"
import {
  createInterviewValidator,
  endInterviewValidator,
  getInterviewByIdValidator,
} from "../validators/interview.validator.js"
import validate from "../middlewares/validate.middleware.js"

const router = Router()

router
  .post("/", createInterviewValidator(), validate, createInterview)
  .get("/", getAllInterviews)
  .get("/:id", getInterviewByIdValidator(), validate, getInterviewById)
  .put("/:id", endInterviewValidator(), validate, endInterview)

export default router
