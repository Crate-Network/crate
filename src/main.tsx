import { render } from "preact"
import { useContext, useEffect, useState } from "preact/hooks"
import Router, { route } from "preact-router"
import AuthContext, { AuthProvider } from "context/AuthContext"
import "./index.css"

import Splash from "./pages/Splash"
import Authenticate, { AuthenticateType } from "./pages/Authenticate"
import Navigation from "./components/Navigation"
import EmailSignIn from "pages/EmailSignIn"
import Community from "pages/Community"
import Files from "./pages/Files"
import Button from "components/Button"
import NotFound from "pages/NotFound"
import Settings from "pages/Settings"
import { FileProvider } from "context/FileContext"

type FloatingError = {
  show: boolean
  message: string
}

const PageInterior = (props) => {
  const { title, component, header, protect } = props
  const { loggedIn, error, auth } = useContext(AuthContext)

  const [errorObj, setErrorObj] = useState<FloatingError>({
    show: false,
    message: "",
  })

  if (!loggedIn && protect) {
    route("/", true)
  }

  useEffect(() => {
    setErrorObj({
      show: !!error,
      message: typeof error === "string" ? error : JSON.stringify(error),
    })
  }, [error])

  useEffect(() => {
    document.title = title || ""
  }, [title])

  return (
    <>
      {header ? header : <Navigation />}
      <div
        className={`fixed flex justify-between items-center align-middle transition-all duration-300 mx-auto left-0 right-0 -top-16 w-4/12 p-4 bg-red-500 bg-opacity-90 shadow-md backdrop-blur-lg z-10 rounded-lg text-white ${
          errorObj.show ? "translate-y-full" : "-translate-y-full"
        }`}
      >
        <span class="text-lg p-1">
          <b>Error: </b>
          {errorObj.message}
        </span>
        <button
          className="font-medium text-neutral-50 rounded-md bg-neutral-400 py-3 px-6"
          onClick={() =>
            setErrorObj((current) => ({ ...current, show: false }))
          }
        >
          Dismiss
        </button>
      </div>
      {component}
    </>
  )
}

const Page = (props) => (
  <AuthProvider>
    <PageInterior {...props} />
  </AuthProvider>
)

const Providers = ({ children }) => (
  <AuthProvider>
    <FileProvider>{children}</FileProvider>
  </AuthProvider>
)

export function App() {
  return (
    <Providers>
      <Router>
        <Page path="/" title={"Crate"} component={<Splash />} />
        <Page
          path="/files"
          title={"Crate - Files"}
          component={<Files />}
          protect
        />
        <Page
          path="/settings"
          title={"Crate - Settings"}
          component={<Settings />}
          protect
        />
        <Page
          path="/community"
          title={"Crate - Community"}
          component={<Community />}
        />
        <Page
          path="/login"
          title={"Login to Crate"}
          component={<Authenticate type={AuthenticateType.LOGIN} />}
        />
        <Page
          path="/email-sign-in"
          title={"Crate - Authorize"}
          component={<EmailSignIn />}
        />
        <Page
          path="/register"
          title={"Register for Crate"}
          component={<Authenticate type={AuthenticateType.REGISTER} />}
        />
        <Page default component={<NotFound />} />
      </Router>
    </Providers>
  )
}

render(<App />, document.getElementById("app")!)
