import { createContext } from "preact"
import { useEffect, useState } from "preact/hooks"

import { FirebaseApp, initializeApp } from "firebase/app"
import { Analytics, getAnalytics } from "firebase/analytics"
import {
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore"
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  signOut,
  Auth,
  User,
  getRedirectResult,
  OAuthProvider,
  UserInfo,
} from "firebase/auth"
import firebaseConfig from "../../firebase"
import UserModel, { defaultUserModel } from "models/UserModel"

type ActionCodeSettingType = { url: string; handleCodeInApp: boolean }
const actionCodeSettings: ActionCodeSettingType = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: import.meta.env.PROD
    ? "https://crate.network/email-sign-in"
    : "http://localhost:3000/email-sign-in",
  handleCodeInApp: true,
}

export type AuthObject = {
  user: UserInfo & { doc: UserModel }
  loggedIn: boolean
  setUser: (user: User) => void
  logout: () => void
  firebase?: FirebaseApp
  auth?: Auth
  analytics?: Analytics
  db?: Firestore
  actionCodeSettings: ActionCodeSettingType
  hasFullKey: boolean
  error: string | null
  providers: {
    google: GoogleAuthProvider
    github: GithubAuthProvider
    apple: OAuthProvider
  }
}

const defaultUser: UserInfo & { doc: UserModel } = {
  displayName: "",
  email: "",
  phoneNumber: "",
  photoURL: "",
  providerId: "",
  uid: "",
  doc: { ...defaultUserModel },
}

const contextDefault: AuthObject = {
  user: null,
  loggedIn: false,
  setUser: () => null,
  logout: () => null,
  actionCodeSettings,
  hasFullKey: false,
  error: null,
  providers: {
    google: new GoogleAuthProvider(),
    github: new GithubAuthProvider(),
    apple: new OAuthProvider("apple.com"),
  },
}

const AuthContext = createContext<AuthObject>(contextDefault)

function AuthProvider(props) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)
  const auth = getAuth(app)
  const db = getFirestore(app)

  // auth.currentUser?.getIdToken().then((token) => console.log(token))

  const { children } = props
  const [user, setUser] = useState<User>(auth.currentUser)
  const [error, setError] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("signedIn") === "true"
  )

  const [userDoc, setUserDoc] = useState<UserModel>(defaultUserModel)
  useEffect(() => {
    if (!user) return
    const userDocRef = doc(
      db,
      "users",
      user.uid.toString()
    ) as DocumentReference<UserModel>

    getDoc(userDocRef)
      .then((doc) => setUserDoc(doc.data()))
      .catch((err) => setError(err.message))
    const unsub = onSnapshot(userDocRef, (doc) => {
      setUserDoc(doc.data())
    })
    return () => unsub()
  }, [user])

  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("signedIn", "true")
      setUser(user)
    } else {
      localStorage.setItem("signedIn", "false")
      setUser(null)
    }
    setLoggedIn(!!user)
  })

  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      setError(err.message)
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setError(null)
    }, 5000)
  }, [error])

  const logout = () => {
    signOut(auth)
      .then(() => setUser({ ...defaultUser, doc: { ...defaultUserModel } }))
      .catch((err) => {
        setError(err.message)
      })
  }

  const result: AuthObject = {
    ...contextDefault,
    user: { ...user, doc: userDoc },
    setUser,
    logout,
    loggedIn,
    firebase: app,
    auth,
    analytics,
    db,
    error,
    hasFullKey: false,
  }

  return <AuthContext.Provider value={result}>{children}</AuthContext.Provider>
}

export default AuthContext
export { AuthProvider }
