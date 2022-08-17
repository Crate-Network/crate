import express from "express"
import { DecodedIdToken } from "firebase-admin/auth"

declare global {
  declare module Express {
    export interface Request {
      token?: DecodedIdToken
      user: string
    }
  }
}
