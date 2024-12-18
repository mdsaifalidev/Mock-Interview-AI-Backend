import { Schema, model } from "mongoose"
import {
  DifficultyLevels,
  DifficultyLevelsEnum,
  NoOfQuestions,
} from "../utils/common.js"

// *Interview schema
const interviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionsAndAnswers: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },
        answer: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    jobExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    noOfQuestions: {
      type: Number,
      enum: NoOfQuestions,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: DifficultyLevels,
      default: DifficultyLevelsEnum.EASY,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// *Interview model
const Interview = model("Interview", interviewSchema)

export default Interview
