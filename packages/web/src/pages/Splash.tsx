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

  const [rValues, setRand] = useState([1, 1, 1, 1] as number[])
  const [opacity, setOpacity] = useState(0)
  const [r1, r2, r3, r4] = rValues.map((v) => v * opacity)
  useEffect(() => {
    const interval = setInterval(() => {
      setRand((arr) => arr.map(Math.random))
    }, 6000)
    setOpacity(1)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col flex-1 h-screen min-h-max">
      <Navigation />
      <div
        style={{
          "border-radius": 50,
          "-webkit-mask-image": "-webkit-radial-gradient(white, black)",
        }}
        className="relative z-10 flex flex-1 overflow-hidden sm:m-16 lg:m-32"
      >
        <img
          src={colorGradientBackdrop}
          style={{
            transitionDuration: "6s",
            opacity,
            transform: `scale(${r1 * 3 + 2}, ${r2 * 3 + 2}) translate(${
              (r3 - 0.5) * 50
            }%, ${(r4 - 0.5) * 50}%)`,
          }}
          className="hidden object-cover w-full aspect-square -z-20 transition-all motion-safe:transform-none ease-in-out sm:block"
        />
        <div className="absolute top-0 left-0 flex flex-col justify-center w-full h-full p-8 bg-orange-100 lg:p-16 bg-opacity-60 dark:bg-stone-900 dark:bg-opacity-60 backdrop-blur-lg">
          <h1 class="font-sans text-4xl sm:text-6xl md:text-8xl xl:text-9xl">
            <span class="block font-bold inline">Cloud storage, </span>
            <span class="block font-black text-orange-600 dark:text-orange-500 inline">
              reimagined.
            </span>
          </h1>
          <p className="sm:max-w-2xl lg:max-w-5xl sm:text-3xl lg:text-5xl">
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
    </div>
  )
}