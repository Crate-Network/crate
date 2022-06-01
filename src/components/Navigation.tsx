import BrightCrateLogo from "assets/light-crate.svg"
import DarkCrateLogo from "assets/dark-crate.svg"
import { useContext, useEffect, useState } from "preact/hooks"
import AuthContext from "context/AuthContext"
import { Link } from "preact-router"
import { signOut } from "firebase/auth"
import Button from "./Button"

function CrateLogo() {
  const [useDark, setUseDark] = useState(false)

  useEffect(() => {
    const watcher = window.matchMedia("(prefers-color-scheme: dark)")
    setUseDark(watcher.matches)
    watcher.onchange = (ev) => setUseDark(ev.matches)
  }, [])

  return useDark ? (
    <DarkCrateLogo className="w-10 lg:w-16 mr-6 crate--shadow" />
  ) : (
    <BrightCrateLogo className="w-10 lg:w-16 mr-6 crate--shadow" />
  )
}

export default function Navigation() {
  const { loggedIn, user } = useContext(AuthContext)
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8">
          <div>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <nav
                className="relative flex items-center justify-between sm:h-10"
                aria-label="Global"
              >
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <Link
                      href="/"
                      className="flex items-center justify-between"
                    >
                      <CrateLogo />
                      <h1 className="font-iaQuattro font-bold text-4xl hidden lg:inline-block">
                        CRATE
                      </h1>
                    </Link>
                  </div>
                </div>
                <div className="ml-10 pr-4 space-x-8">
                  <span className="space-x-8">
                    <Link
                      href="/community"
                      className="font-medium text-gray-500 dark:text-gray-300 hover:text-neutral-400"
                    >
                      Community
                    </Link>
                  </span>
                  {!loggedIn ? (
                    <>
                      <span className="space-x-8">
                        <Link
                          href="/features"
                          className="font-medium text-gray-500 dark:text-gray-300 hover:text-neutral-400"
                        >
                          Features
                        </Link>

                        <Link
                          href="/plans"
                          className="font-medium text-gray-500 dark:text-gray-300 hover:text-neutral-400"
                        >
                          Plans & Pricing
                        </Link>
                      </span>
                      <span className="space-x-4">
                        <Link
                          href="/login"
                          className="font-medium text-neutral-50 rounded-md hover:text-neutral-300 bg-gray-500 py-3 px-6"
                        >
                          Log in
                        </Link>

                        <Link
                          href="/register"
                          className="font-medium text-neutral-50 rounded-md hover:text-neutral-300 bg-orange-500 py-3 px-6"
                        >
                          Register
                        </Link>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="space-x-4">
                        <Link
                          href="/"
                          className="font-medium text-neutral-50 rounded-md bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-all py-3 px-6"
                        >
                          Files
                        </Link>
                        <Link
                          href="/settings"
                          className="font-medium text-neutral-50 rounded-md hover:text-neutral-300 bg-neutral-400 dark:bg-neutral-600 py-3 px-6"
                        >
                          Settings
                        </Link>
                      </span>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
