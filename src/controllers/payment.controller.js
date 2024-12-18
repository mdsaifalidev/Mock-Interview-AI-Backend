import Stripe from "stripe"
import asyncHandler from "express-async-handler"
import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/user.model.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * @function createCheckoutSession
 * @description Create a checkout session
 * @access Private
 * @route POST /api/v1/payments/create-checkout-session
 * @returns {Object}
 */
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { product } = req.body
  const { name, price, maxNoOfQuestions, credits } = product

  // *Create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: name,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      maxNoOfQuestions: maxNoOfQuestions,
      credits: credits,
      userId: req.user._id.toString(),
    },
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/dashboard/success`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard/failure`,
  })

  res
    .status(200)
    .json(new ApiResponse(200, "Checkout session created", checkoutSession?.id))
})

/**
 * @function checkoutSuccess
 * @description Handle checkout success
 * @access Private
 * @route POST /api/v1/payments/checkout-success
 * @returns {Object}
 */
const checkoutSuccess = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"]

  // *Verify the signature
  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  // *Check if the event is checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const maxNoOfQuestions = parseInt(session.metadata.maxNoOfQuestions)
    const credits = parseInt(session.metadata.credits)
    const userId = session.metadata.userId

    // *Update user
    const user = await User.findById(userId)
    user.credits += credits
    user.maxNoOfQuestions += maxNoOfQuestions
    await user.save()

    res.status(200).json(new ApiResponse(200, "Checkout session completed"))
  }
})

export { createCheckoutSession, checkoutSuccess }
