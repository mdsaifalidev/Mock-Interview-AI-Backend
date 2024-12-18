import { Schema, model } from "mongoose"

// *Package schema
const packagesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
    },
    maxNoOfQuestions: {
      type: Number,
      default: 5,
      min: 5
    },
    features: [{ type: String, required: true, trim: true }],
  },
  { timestamps: true }
)

// *Package model
const Package = model("Package", packagesSchema)

export default Package