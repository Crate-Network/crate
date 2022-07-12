import { render } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import Router, { route } from "preact-router"
import "./index.css"

import Splash from "./pages/Splash"
import Authenticate, { AuthenticateType } from "./pages/Authenticate"
import Navigation from "./components/Navigation"
import EmailSignIn from "./pages/EmailSignIn"
import Community from "./pages/Community"
import Files from "./pages/Files"
import NotFound from "./pages/NotFound"
import Settings from "./pages/Settings"
import { useErrorStore } from "./store/ErrorStore"
import { useUserStore } from "./store/UserStore"

const Page = (props) => {
  const { title, component, header, protect } = props
  const loggedIn = useUserStore((state) => state.signedIn)
  const errorStore = useErrorStore()

  useErrorBoundary((error: Error) => {
    console.error(error)
    errorStore.showError(error)
  })

  if (!loggedIn && protect) {
    route("/", true)
  }

  useEffect(() => {
    document.title = title || ""
  }, [title])

  return (
    <>
      {header ? header : <Navigation />}
      <div
        className={`fixed flex justify-between items-center align-middle transition-all duration-300 mx-auto left-0 right-0 -top-16 w-4/12 p-4 bg-red-500 bg-opacity-90 shadow-md backdrop-blur-lg z-10 rounded-lg text-white ${
          errorStore.displayed
            ? "translate-y-full opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <span class="text-lg p-1">
          <b>{errorStore.name || "Error"}: </b>
          {errorStore.message}
        </span>
        <button
          className="font-medium text-neutral-50 rounded-md bg-neutral-400 py-3 px-6"
          onClick={errorStore.hide}
        >
          Dismiss
        </button>
      </div>
      {component}
    </>
  )
}

export function App() {
  return (
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
  )
}

render(<App />, document.getElementById("app"))
