import { CID } from "@crate/common"
import { UserModel } from "@crate/types"
import { firestore } from "./firebase-client"

export const userRef = async (uid: string) =>
  firestore.collection("users").doc(uid)

export const getUserDoc = async (uid: string) =>
  (await (await userRef(uid)).get()) as unknown as UserModel

export const setUserDoc = async (uid: string, model: Partial<UserModel>) =>
  await (await userRef(uid)).set(model)

export const setRootCID = async (uid: string, newCID: CID) =>
  setUserDoc(uid, { rootCID: newCID.toString() })

export const getRootCID = async (uid: string) => (await getUserDoc(uid)).rootCID
