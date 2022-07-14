import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express"
import ipfs from "../clients/ipfs"
import logger from "../logger"

const router = Router()

const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }

const get: RequestHandler = async (req, res) => {
  const { path, cid } = {
    path: "/",
    cid: null,
    ...req.query,
  }
  logger.info(path)
  logger.info(cid)

  res.send()
}

const post: RequestHandler = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      error: { reason: "BAD_REQUEST", details: "No files were uploaded." },
    })
  }

  const { files } = req.files
  const fileArr = Array.isArray(files) ? files : [files]
  const models = await ipfs.add(fileArr)

  logger.info(JSON.stringify(models))
  res.send(models)

  return
}

router.get("/", asyncHandler(get))
router.post("/", asyncHandler(post))

export default router
