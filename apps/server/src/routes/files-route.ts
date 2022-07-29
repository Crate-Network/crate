import { RequestHandler, Router } from "express"
import logger from "../logger"
import * as fs from "fs"
import fileClient from "../clients/files"
import { asyncHandler, defaultPath } from "./utils"

const { getFile, addFile } = fileClient

const router = Router()

const post: RequestHandler = async (req, res) => {
  if (!req.token) return
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send({
      error: { reason: "BAD_REQUEST", details: "No files were uploaded." },
    })
    return
  }

  const { path } = {
    path: await defaultPath(req.token.uid),
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
}

// const del: RequestHandler = async (req, res) => {}

router.get("/", (req, res) => {
  if (!req.token) return
  const { path } = {
    path: `/ipfs/${req.token.uid}`,
    ...req.query,
  }

  getFile({ path })
    .then((model) => res.send(model))
    .catch((err) => res.status(500).send(err))
})

router.post("/", asyncHandler(post))
// router.delete("/", asyncHandler(del))

export default router
