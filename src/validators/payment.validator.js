import { body} from "express-validator"

const createCheckoutSessionValidator = () => [
    body("product").notEmpty().withMessage("Product is required"),
    body("product.name").trim().escape().notEmpty().withMessage("Name is required"),
    body("product.price").trim().escape().notEmpty().withMessage("Price is required"),
    body("product.maxNoOfQuestions").trim().escape().notEmpty().withMessage("Max no of questions is required"),
    body("product.credits").trim().escape().notEmpty().withMessage("Credits is required"),
]

export { createCheckoutSessionValidator }