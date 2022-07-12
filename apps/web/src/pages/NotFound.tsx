import Button from "../components/Button"
import { route } from "preact-router"

export default function NotFound() {
  return (
    <div>
      <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <h1 class="text-2xl font-medium">That page does not exist.</h1>
        <br />
        <Button
          onClick={() => {
            route("/", true)
          }}
          class="text-white"
        >
          Home
        </Button>
      </main>
    </div>
  )
}
