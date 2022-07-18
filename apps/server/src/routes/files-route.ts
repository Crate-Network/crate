import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express"
import logger from "../logger"
import * as fs from "fs"
import { create } from "@crate/files-client"
import { getRootCID } from "@crate/user-client"

const { getFile, addFile } = create({
  url: process.env["IPFS_CLIENT_URL"],
  timeout: 5000,
})

const router = Router()
const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }

const post: RequestHandler = async (req, res) => {
  if (!req.token) return
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      error: { reason: "BAD_REQUEST", details: "No files were uploaded." },
    })
  }

  const { path } = {
    path: `/ipfs/${await getRootCID(req.token.uid)}`,
    ...req.query,
  }

  const { files } = req.files
  const fileArr = Array.isArray(files) ? files : [files]

  const bufs = await Promise.all(
    fileArr.map((file) => fs.createReadStream(file.tempFilePath))
  )

  const models = await addFile({
    path,
    uid: req.token.uid,
    fileNames: fileArr.map((f) => f.name),
    files: bufs,
  })

  logger.info(JSON.stringify(models))
  res.send(models)

  return
}

// const del: RequestHandler = async (req, res) => {}

router.get("/", (req, res) => {
  const { path } = {
    path: `/ipfs/${req.token?.uid}`,
    ...req.query,
  }

  getFile({ path })
    .then((model) => res.send(model))
    .catch((err) => res.status(500).send(err))
})

router.post("/", asyncHandler(post))
// router.delete("/", asyncHandler(del))

export default router
