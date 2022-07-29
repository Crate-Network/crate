import { RequestHandler, Router } from "express"
import fileClient from "../clients/files"
import { asyncHandler } from "./utils"

const { mkdir, dirAdd } = fileClient

const router = Router()

const routeMkdir: RequestHandler = async (req, res) => {
  if (typeof req.query["name"] !== "string") {
    res.status(400).send("Requires 'name'")
    return
  }

  mkdir({ name: req.query["name"] })
  res.send("done")
}

const routeDirAdd: RequestHandler = async (req, res) => {
  res.send("done")
}

router.post("/", asyncHandler(routeMkdir))
router.post("/add", asyncHandler(routeDirAdd))

export default router
