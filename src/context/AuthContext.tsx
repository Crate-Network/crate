import { createContext } from "preact"
import { useEffect, useState } from "preact/hooks"

import { FirebaseApp, initializeApp } from "firebase/app"
import { Analytics, getAnalytics } from "firebase/analytics"
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
} from "firebase/auth"
import firebaseConfig from "../../firebase"

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: import.meta.env.PROD
    ? "https://crate.network/email-sign-in"
    : "http://localhost:3000/email-sign-in",
  handleCodeInApp: true,
}

type AuthObject = {
  user: User | null
  loggedIn: boolean
  setUser: (user: User) => void
  logout: () => void
  firebase?: FirebaseApp
  auth?: Auth
  analytics?: Analytics
  hasFullKey: boolean
  error: string | null
  providers: {
    google: GoogleAuthProvider
    github: GithubAuthProvider
  }
}

const contextDefault = {
  user: null,
  loggedIn: false,
  setUser: () => null,
  logout: () => null,
  hasFullKey: false,
  actionCodeSettings,
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

  const { children } = props
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [error, setError] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("signedIn") === "true"
  )

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
      .then(() => setUser(null))
      .catch(setError)
  }

  const result: AuthObject = {
    ...contextDefault,
    user,
    setUser,
    logout,
    loggedIn,
    firebase: app,
    auth,
    analytics,
    error,
    hasFullKey: false,
  }

  return <AuthContext.Provider value={result}>{children}</AuthContext.Provider>
}

export default AuthContext
export { AuthProvider }
