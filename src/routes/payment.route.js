import { Router } from "express"
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import { createCheckoutSessionValidator } from "../validators/payment.validator.js"
import validate from "../middlewares/validate.middleware.js"

const router = Router()

router
  .post("/create-checkout-session", verifyJWT, createCheckoutSessionValidator(), validate, createCheckoutSession)
  .post("/checkout-success", checkoutSuccess)

export default router
