import Button from "components/Button"
import FormBox from "components/FormBox"
import FormInput from "components/FormInput"
import AppleLogo from "assets/signin-apple-logo.svg"
import { sendSignInLinkToEmail, signInWithRedirect } from "firebase/auth"
import { Link, route } from "preact-router"
import { useState } from "preact/hooks"
import { actionCodeSettings, auth, providers } from "vendor/firebase"
import { useUserStore } from "store/UserStore"

export enum AuthenticateType {
  REGISTER = "Register",
  LOGIN = "Login",
}

type SignInBtnProps = {
  providerText: string
  disabled: boolean
  handleProvider: (cb: () => Promise<void>) => void
}

function SignInWithGoogle({
  handleProvider,
  disabled,
  providerText,
}: SignInBtnProps) {
  const useGoogle = handleProvider(async () => {
    await signInWithRedirect(auth, providers.google)
  })

  return (
    <Button
      id="google-signin"
      disabled={disabled}
      className="text-black p-2 w-full h-8 overflow-hidden bg-gray-100 mt-4 flex flex-row justify-between hover:shadow-md transition-shadow align-middle items-center"
      onClick={useGoogle}
    >
      <img
        className="h-8 p-2"
        alt="Google sign-in"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
      />
      {providerText} with Google
      <span />
    </Button>
  )
}

function SignInWithGithub({
  handleProvider,
  disabled,
  providerText,
}: SignInBtnProps) {
  const useGitHub = handleProvider(async () => {
    await signInWithRedirect(auth, providers.github)
  })

  return (
    <Button
      id="github-signin"
      disabled={disabled}
      className="text-black p-2 w-full h-8 overflow-hidden bg-gray-100 mt-4 flex flex-row justify-between hover:shadow-md transition-shadow align-middle items-center"
      onClick={useGitHub}
    >
      <img
        className="h-8 p-2"
        alt="GitHub sign-in"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Font_Awesome_5_brands_github.svg/2560px-Font_Awesome_5_brands_github.svg.png"
      />
      {providerText} with GitHub
      <span />
    </Button>
  )
}

function SignInWithApple({
  handleProvider,
  disabled,
  providerText,
}: SignInBtnProps) {
  const useApple = handleProvider(async () => {
    await signInWithRedirect(auth, providers.apple)
  })
  return (
    <Button
      id="apple-signin"
      disabled={disabled}
      className="text-white p-2 w-full h-9 overflow-hidden bg-black mt-4 flex flex-row justify-between hover:shadow-md transition-shadow align-middle items-center"
      onClick={useApple}
    >
      <AppleLogo className="h-8 mt-0.5" alt="Apple sign-in" />
      {providerText} with Apple
      <span />
    </Button>
  )
}

export default function Authenticate({ type }: { type: AuthenticateType }) {
  const loggedIn = useUserStore((state) => state.signedIn)

  if (loggedIn) route("/files", true)

  const [disableInputs, setDisableInputs] = useState(false)
  const providerText = type === AuthenticateType.LOGIN ? "Sign in" : "Sign up"

  const handleProvider = (providerCb: () => void) => async () => {
    setDisableInputs(true)
    try {
      await providerCb()
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.error(errorCode, errorMessage)
    }
    setDisableInputs(false)
  }

  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const useEmail = handleProvider(async () => {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    window.localStorage.setItem("emailForSignIn", email)
    setEmailSent(true)
  })

  if (emailSent)
    return (
      <div className="flex w-full justify-center items-center">
        <div className="font-sans text-2xl font-medium">
          A link has been sent to your email. Click it to log in.
        </div>
      </div>
    )

  return (
    <FormBox className="mt-8 md:mt-24 xl:mt-36">
      <h1 className="font-bold text-2xl pb-4">{type}</h1>
      <FormInput
        id="email"
        placeholder="Enter your email"
        type="email"
        value={email}
        disabled={disableInputs}
        onInput={(e) => {
          if (e) setEmail(e.target.value)
        }}
      />
      <Button
        className="block w-full my-4 text-white"
        onClick={useEmail}
        disabled={disableInputs || email === "" || !email}
      >
        {providerText} with Email
      </Button>
      <SignInWithApple
        disabled={disableInputs}
        providerText={providerText}
        handleProvider={handleProvider}
      />
      {/* <SignInWithGoogle
        disabled={disableInputs}
        providerText={providerText}
        handleProvider={handleProvider}
      />
      <SignInWithGitHub
        disabled={disableInputs}
        providerText={providerText}
        handleProvider={handleProvider}
      /> */}
      <div className="mt-4 mb-1 h-px w-full bg-gray-300 dark:bg-gray-600" />
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {type === AuthenticateType.LOGIN ? (
          <>
            New here?{" "}
            <Link className="underline" href="/register">
              Register an account.
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link className="underline" href="/login">
              Sign in.
            </Link>
          </>
        )}
      </span>
    </FormBox>
  )
}
