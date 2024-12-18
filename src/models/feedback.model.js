import { Schema, model } from "mongoose"

// *Feedback schema
const feedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    feedbacks: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Interview.questionsAndAnswers",
          required: true,
        },
        userAnswer: {
          type: String,
          required: true,
          trim: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        feedback: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
)

// *Feedback model
const Feedback = model("Feedback", feedbackSchema)

export default Feedback
