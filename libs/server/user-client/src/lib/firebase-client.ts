import { applicationDefault, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

export const firebaseApp = initializeApp({
  credential: applicationDefault(),
})
export const firestore = getFirestore(firebaseApp)
export const auth = getAuth()
