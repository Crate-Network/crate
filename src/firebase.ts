import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const firebaseApp = initializeApp({
  credential: applicationDefault(),
});
const firestore = getFirestore(firebaseApp);
const auth = getAuth();

export { firebaseApp, firestore, auth };
