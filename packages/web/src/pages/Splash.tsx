import { Link, route } from "preact-router"
import { useEffect, useState } from "preact/hooks"
import Navigation from "../components/Navigation"
import { useUserStore } from "../store/UserStore"
import colorGradientBackdrop from "../assets/color-gradient-backdrop.svg"

export default function Splash() {
  const loggedIn = useUserStore((state) => state.signedIn)
  useEffect(() => {
    if (loggedIn) {
      route("/files", true)
    }
  }, [loggedIn])

  const [[r1, r2, r3, r4, r5], setRand] = useState([1, 1, 1, 1, 1] as number[])
  const [opacity, setOpacity] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setRand((arr) => arr.map(Math.random))
    }, 6000)
    setOpacity(1)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <Navigation className="absolute top-0 w-full" />
      <img
        src={colorGradientBackdrop}
        style={{
          transitionDuration: "6s",
          opacity,
          filter: `saturate(${150 * r4 + 250}%) blur(${r5 * 4}rem)`,
          transform: `scale(${r1 * 3 + 1.5}, ${r2 * 3 + 1.5}) rotate(${
            r3 * 360
          }deg)`,
        }}
        className="absolute top-0 object-cover h-full min-w-full -z-20 transition-all motion-safe:transform-none ease-in-out"
      />
      <div className="flex items-center justify-center h-screen p-8 mx-auto bg-orange-100 2xl:px-24 bg-opacity-80 dark:bg-stone-900 dark:bg-opacity-80">
        <div class="w-full mt-16">
          <h1 class="font-sans sm:text-5xl lg:text-7xl">
            <span class="block font-bold xl:inline">Cloud storage, </span>
            <span class="block font-black text-orange-600 dark:text-orange-500 xl:inline">
              reimagined.
            </span>
          </h1>
          <p className="sm:max-w-xl lg:max-w-3xl sm:text-2xl lg:text-4xl">
            Store your files securely, with crypographically-verified guarantees
            on data accessibility. Access your files on all your devices, from
            anywhere in the world. Store as much data as you want. Get 1 TB of
            storage for just
            <span class="font-bold"> $10/month</span>.
          </p>
          <div class="flex mt-12 space-x-8">
            <Link
              href="/register"
              class="flex items-center justify-center bg-orange-500 text-white w-40 h-16 justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md"
            >
              Get started
            </Link>
            <Link
              href="#"
              class="flex items-center justify-center inline-block bg-stone-500 text-gray-100 w-40 h-16 justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full h-screen bg-stone-500 bg-opacity-80 backdrop-blur-lg" />
    </div>
  )
}
