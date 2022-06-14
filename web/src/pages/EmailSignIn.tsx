import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { route } from "preact-router"
import { useEffect } from "preact/hooks"
import { useErrorStore } from "store/ErrorStore"
import { auth } from "vendor/firebase"

export default function EmailLanding() {
  const showError = useErrorStore((state) => state.showMessage)
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn")
      while (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation")
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn")
        })
        .catch((error) => showError(error.message))
    }
    route("/", true)
  }, [])

  return null
}
