import AuthContext from "context/AuthContext"
import { Link, route } from "preact-router"
import { useContext } from "preact/hooks"

export default function Splash() {
  const { loggedIn } = useContext(AuthContext)
  if (loggedIn) {
    route("/files", true)
  }
  return (
    <div>
      <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-38 sm:px-6 md:mt-16 lg:mt-40 lg:px-8 xl:mt-60">
        <div class="sm:text-center lg:text-left">
          <h1 class="text-4xl tracking-tight font-bold text-gray-800 dark:text-gray-100 sm:text-5xl md:text-6xl">
            <span class="block xl:inline">Cloud storage, </span>
            <span class="block font-extrabold text-orange-600 dark:text-orange-500 xl:inline">
              reimagined.
            </span>
          </h1>
          <p class="mt-3 text-base text-gray-700 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Store your files securely, with crypographically-verified guarantees
            on data accessibility. Access your files on all your devices, from
            anywhere in the world. Store as much data as you want. Get 1 TB of
            storage for just
            <span class="font-bold"> $10/month</span>.
          </p>
          <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div class="rounded-md shadow">
              <Link
                href="/register"
                class="w-full bg-orange-500 text-white flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10"
              >
                Get started
              </Link>
            </div>
            <div class="mt-3 sm:mt-0 sm:ml-3">
              <Link
                href="#"
                class="w-full bg-gray-500 text-gray-100 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
