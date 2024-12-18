import { Router } from "express"
import { getAllPackages } from "../controllers/package.controller.js"

const router = Router()

router.get("/", getAllPackages)

export default router
