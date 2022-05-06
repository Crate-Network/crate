import { render } from "preact"
import { useContext, useEffect, useState } from "preact/hooks"
import Router, { route } from "preact-router"
import AuthContext, { AuthProvider } from "context/AuthContext"
import "./index.css"

import Splash from "./pages/Splash"
import Authenticate, { AuthenticateType } from "./pages/Authenticate"
import Navigation from "./components/Navigation"
import EmailSignIn from "pages/EmailSignIn"
import Browse from "pages/Browse"
import Files from "./pages/Files"
import Button from "components/Button"
import NotFound from "pages/NotFound"
import Settings from "pages/Settings"

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
      message: error,
    })
  }, [error])

  useEffect(() => {
    document.title = title || ""
  }, [title])

  return (
    <>
      {header ? header : <Navigation />}
      <div
        className={`absolute flex justify-between align-middle transition-all duration-300 mx-auto left-0 right-0 w-4/12 p-4 bg-redwood-300 z-10 rounded-lg text-white ${
          errorObj.show ? "top-8" : "-top-32"
        }`}
      >
        <span class="text-lg p-1">
          <b>Error: </b>
          {errorObj.message}
        </span>
        <Button
          onClick={() =>
            setErrorObj((current) => ({ ...current, show: false }))
          }
        >
          Dismiss
        </Button>
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

export function App() {
  return (
    <AuthProvider>
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
        <Page path="/browse" title={"Crate - Browse"} component={<Browse />} />
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
    </AuthProvider>
  )
}

render(<App />, document.getElementById("app")!)
