import { RequestHandler, Router } from "express"
import logger from "../logger"
import * as fs from "fs"
import fileClient from "../clients/files"
import { asyncHandler, defaultPath } from "./utils"

const { getFile, addFile, rmFile } = fileClient

const router = Router()

const post: RequestHandler = async (req, res) => {
  if (!req.token) throw new Error("Token expected to exist.")
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send({
      error: { reason: "BAD_REQUEST", details: "No files were uploaded." },
    })
    return
  }

  const { uid } = req.token
  const { path } = {
    path: await defaultPath(uid),
    ...req.query,
  }

  const { files } = req.files
  const fileArr = Array.isArray(files) ? files : [files]

  const models = await Promise.all(
    fileArr.map(async (file) => {
      const buffer = fs.createReadStream(file.tempFilePath)
      return await addFile({
        path,
        uid,
        filename: file.name,
        file: buffer,
      })
    })
  )

  logger.info(JSON.stringify(models))
  res.send(models)
}

const get: RequestHandler = async (req, res) => {
  if (!req.token) throw new Error("Token expected to exist.")
  const { path } = {
    path: `/ipfs/${req.token.uid}`,
    ...req.query,
  }

  const model = await getFile({ path })
  res.send(model)
}

const del: RequestHandler = async (req, res) => {
  if (!req.token) throw new Error("Token expected to exist.")
  const { path } = {
    path: `/ipfs/${req.token.uid}`,
    ...req.query,
  }

  const newPath = await rmFile({ path, uid: req.token.uid })
  const model = await getFile({ path: newPath })
  res.send(model)
}

router.get("/", asyncHandler(get))
router.post("/", asyncHandler(post))
router.delete("/", asyncHandler(del))

export default router
