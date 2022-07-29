import { getRootCID } from "@crate/user-client"
import { RequestHandler, Request, Response, NextFunction } from "express"

export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }

export const defaultPath = async (uid: string) =>
  `/ipfs/${await getRootCID(uid)}`
