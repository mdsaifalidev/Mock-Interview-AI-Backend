import asyncHandler from "express-async-handler"
import Feedback from "../models/feedback.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import chatSession from "../utils/geminiai.js"
import ApiError from "../utils/ApiError.js"

/**
 * @function createFeedback
 * @description Create a feedback
 * @access Private
 * @route POST /api/v1/feedbacks
 * @returns {Object}
 */
const createFeedback = asyncHandler(async (req, res) => {
  const { interviewId, questionId } = req.query
  const { question, userAnswer } = req.body

  const prompt = `
    Question: ${question}
    User Answer: ${userAnswer},
    Based on the question and the user’s answer, please provide a rating (0 to 5) and feedback for improvement in the following JSON format:
    {
      "rating": <0-5>,
      "feedback": "<Provide constructive feedback on how to improve the answer. Limit the feedback to 3-5 lines.>"
    }
    Make sure the rating is a number between 0 and 5, and the feedback is clear and actionable.
  `

  const result = await chatSession.sendMessage(prompt)
  const cleanResult = result.response.candidates[0].content.parts[0].text
    .replace("```json\n", "")
    .replace("\n```", "")
  const feedback = JSON.parse(cleanResult)

  // *Check if feedback already exists
  const feedbackExists = await Feedback.findOne({
    userId: req.user._id,
    interviewId,
  })

  if (feedbackExists) {
    // *Check if question already exists
    const questionExists = feedbackExists.feedbacks.find(
      (feedback) => feedback.questionId.toString() === questionId
    )

    if (questionExists) {
      throw new ApiError(400, "Feedback for this question already exists")
    }

    // *Update feedback
    feedbackExists.feedbacks.push({
      questionId,
      userAnswer,
      rating: feedback.rating,
      feedback: feedback.feedback,
    })

    await feedbackExists.save()
  } else {
    // *Create feedback
    await Feedback.create({
      userId: req.user._id,
      interviewId,
      feedbacks: [
        {
          questionId,
          userAnswer,
          rating: feedback.rating,
          feedback: feedback.feedback,
        },
      ],
    })
  }

  res.status(201).json(new ApiResponse(201, "Answer saved successfully"))
})

/**
 * @function getFeedbackById
 * @description Get feedback by id
 * @access Private
 * @route GET /api/v1/feedbacks/:id
 * @returns {Object}
 */
const getFeedbackById = asyncHandler(async (req, res) => {
  const { id } = req.params

  // *Check if feedback exists
  const feedback = await Feedback.findOne({
    userId: req.user?._id,
    interviewId: id,
  })
  .populate({
    path: "interviewId",
    select: "questionsAndAnswers",
  })
  .lean();
  
  const result = feedback?.feedbacks?.map((item) => {
    const questionAnswer = feedback?.interviewId?.questionsAndAnswers?.find(
      (qa) => qa?._id.toString() === item?.questionId.toString()
    )

    return {
      question: questionAnswer?.question,
      answer: questionAnswer?.answer,
      userAnswer: item?.userAnswer,
      rating: item?.rating,
      feedback: item?.feedback,
    }
  })

  res
    .status(200)
    .json(new ApiResponse(200, "Feedback fetched successfully", result))
})

export { createFeedback, getFeedbackById }
