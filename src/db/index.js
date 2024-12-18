import { connect } from "mongoose"

/**
 * @function connectDB
 * @description Connects to MongoDB
 * @returns {void}
 */
const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB
