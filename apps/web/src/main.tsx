import { render } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import Router, { route } from "preact-router"
import AsyncRoute from "preact-async-route"
import "./index.css"

import Splash from "./pages/Splash"
import Authenticate, { AuthenticateType } from "./pages/Authenticate"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import NotFound from "./pages/NotFound"
import { useErrorStore } from "./store/ErrorStore"
import { useUserStore } from "./store/UserStore"
import Markdown from "./pages/Markdown"
import { html as PrivacyPolicy } from "@crate/content/privacy-policy.md"
import { html as TermsOfUse } from "@crate/content/terms-of-use.md"
import { JSXInternal } from "preact/src/jsx"
import Community from "./pages/Community"

type PageProps = {
  title: string
  path?: string
  children: JSXInternal.Element
  header?: JSXInternal.Element
  default?: boolean
  protect?: boolean
  breadcrumbs?: { name: string; link: string }[]
}

const Page = (props: PageProps) => {
  const { title, children, header, protect, breadcrumbs } = props
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
    <div className="relative min-h-screen pb-48">
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
      <div>{children}</div>
      <Footer
        breadcrumbs={
          breadcrumbs
            ? breadcrumbs
            : [
                {
                  name: title.includes("Crate - ")
                    ? title.split(" - ")[1]
                    : title,
                  link: props.path,
                },
              ]
        }
      />
    </div>
  )
}

export function App() {
  return (
    <Router>
      <Page path="/" title={"Crate"}>
        <Splash />
      </Page>
      <Page path="/files" title={"Crate - Files"} protect>
        <AsyncRoute
          path="/files"
          getComponent={async () => (await import("./pages/Files")).default}
        />
      </Page>
      <Page path="/settings" title={"Crate - Settings"} protect>
        <AsyncRoute
          path="/settings"
          getComponent={async () => (await import("./pages/Settings")).default}
        />
      </Page>
      <Page path="/community" title={"Crate - Community"}>
        <Community />
      </Page>
      <Page path="/privacy-policy" title={"Crate - Privacy Policy"}>
        <Markdown html={PrivacyPolicy} />
      </Page>
      <Page path="/terms-of-use" title={"Crate - Terms of Use"}>
        <Markdown html={TermsOfUse} />
      </Page>
      <Page path="/email-sign-in" title={"Crate - Authorize"}>
        <AsyncRoute
          path="/email-sign-in"
          getComponent={async () =>
            (await import("./pages/EmailSignIn")).default
          }
        />
      </Page>
      <Page path="/login" title={"Crate - Login"}>
        <Authenticate type={AuthenticateType.LOGIN} />
      </Page>
      <Page path="/register" title={"Crate - Register"}>
        <Authenticate type={AuthenticateType.REGISTER} />
      </Page>
      <Page default title="Crate - 404 Not Found">
        <NotFound />
      </Page>
    </Router>
  )
}

render(<App />, document.getElementById("app"))
