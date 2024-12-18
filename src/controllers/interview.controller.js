import asyncHandler from "express-async-handler"
import Interview from "../models/interview.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import chatSession from "../utils/geminiai.js"
import Feedback from "../models/feedback.model.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"

/**
 * @function createInterview
 * @description Create an interview
 * @access Private
 * @route POST /api/v1/interviews
 * @returns {Object}
 */
const createInterview = asyncHandler(async (req, res) => {
  const { jobRole, jobDescription, jobExperience, noOfQuestions, difficulty } =
    req.body
  const userId = req.user?._id

  // *Check if user has enough credits
  const creditsLeft = await User.findById(userId).select(
    "credits maxNoOfQuestions"
  )
  if (creditsLeft?.credits < 1) {
    throw new ApiError(400, "You don't have enough credits")
  }

  if (noOfQuestions > creditsLeft?.maxNoOfQuestions) {
    throw new ApiError(
      400,
      `Max no. of question is ${creditsLeft?.maxNoOfQuestions}`
    )
  }

  const prompt = `
    Job Role: ${jobRole}
    Job Description: ${jobDescription}
    Years of Experience: ${jobExperience}
    Difficulty: ${difficulty}
    Generate exactly ${noOfQuestions} interview questions and answers in the following JSON format:
    [
      {
        "question": "question_text",
        "answer": "answer_text"
      },
      ...
    ]
    The questions should be related to ${jobRole} with appropriate difficulty based on the provided years of experience and difficulty level.
`

  const result = await chatSession.sendMessage(prompt)
  const cleanResult = result.response.candidates[0].content.parts[0].text
    .replace("```json\n", "")
    .replace("\n```", "")
  console.log(cleanResult)
  const questionsAndAnswers = JSON.parse(cleanResult)

  // *Create interview
  const interview = await Interview.create({
    userId,
    questionsAndAnswers,
    jobRole,
    jobDescription,
    jobExperience,
    noOfQuestions,
    difficulty,
  })

  // *Update user credits
  await User.findByIdAndUpdate(userId, {
    $set: {
      credits: creditsLeft.credits - 1,
    },
  })
  res
    .status(201)
    .json(
      new ApiResponse(201, "Interview created successfully", interview?._id)
    )
})

/**
 * @function getAllInterviews
 * @description Get all interviews
 * @access Private
 * @route GET /api/v1/interviews
 * @returns {Object}
 */
const getAllInterviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 3
  const skip = (page - 1) * limit

  const interviews = await Interview.find({ userId: req.user?._id })
    .select("-userId -questionsAndAnswers")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })

  const total = await Interview.countDocuments({ userId: req.user?._id })
  const hasMore = total > skip + interviews.length

  res.status(200).json(
    new ApiResponse(200, "Interview fetched successfully", {
      interviews,
      hasMore,
      total,
      currentPage: page,
    })
  )
})

/**
 * @function getInterviewById
 * @description Get interview by id
 * @access Private
 * @route GET /api/v1/interviews/:id
 * @returns {Object}
 */
const getInterviewById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const interview = await Interview.findById(id)
  res
    .status(200)
    .json(new ApiResponse(200, "Interview fetched successfully", interview))
})

/**
 * @function endInterview
 * @description End interview
 * @access Private
 * @route PUT /api/v1/interviews/:id
 * @returns {Object}
 */
const endInterview = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user._id

  const feedbackExists = await Feedback.findOne({
    userId,
    interviewId: id,
  })

  if (!feedbackExists) {
    throw new ApiError(404, "Please attempt at least one question")
  }

  await Interview.findOneAndUpdate(
    { _id: id, userId },
    {
      $set: {
        isCompleted: true,
      },
    }
  )

  res.status(200).json(new ApiResponse(200, "Interview ended successfully"))
})

export { createInterview, getAllInterviews, getInterviewById, endInterview }
