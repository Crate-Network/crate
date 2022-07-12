import express from "express"
import { DecodedIdToken } from "firebase-admin/auth"

declare global {
  namespace Express {
    interface Request {
      token?: DecodedIdToken
    }
  }
}
