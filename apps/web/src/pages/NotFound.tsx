import Button from "../components/Button"
import { route } from "preact-router"

export default function NotFound() {
  return (
    <div>
      <main class="max-w-screen-2xl">
        <h3>That page does not exist.</h3>
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
