import "dotenv/config"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import hpp from "hpp"
import mongoSanitize from "express-mongo-sanitize"
import cookieParser from "cookie-parser"
import connectDB from "./db/index.js"
import verifyJWT from "./middlewares/auth.middleware.js"

const app = express()

// *Middlewares
app.use(helmet())
app.use(
  cors({
    origin: "https://mockaiinterview.vercel.app",
    credentials: true,
  })
)
app.use(
  "/api/v1/payments/checkout-success",
  express.raw({ type: "application/json" })
)
app.use(cookieParser())
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/payments/checkout-success") {
    next()
  } else {
    express.json({ limit: "16kb" })(req, res, next)
  }
})
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(hpp())
app.use(mongoSanitize())

// *Routes
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import feedbackRouter from "./routes/feedback.route.js"
import packageRouter from "./routes/package.route.js"
import paymentRouter from "./routes/payment.route.js"

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", verifyJWT, userRouter)
app.use("/api/v1/interviews", verifyJWT, interviewRouter)
app.use("/api/v1/feedbacks", verifyJWT, feedbackRouter)
app.use("/api/v1/payments", paymentRouter)
app.use("/api/v1/packages", packageRouter)

// *Error handling Middleware
import errorHandler from "./middlewares/error.middleware.js"

app.use(errorHandler)

// *Connect to DB
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })
