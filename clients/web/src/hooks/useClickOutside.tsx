import { Inputs, MutableRef, useEffect } from "preact/hooks"

export default function useClickOutside(
  ref: MutableRef<HTMLElement>,
  onClickOutside: (e: MouseEvent) => void,
  opts?: {
    deps?: Inputs
    events?: (keyof DocumentEventMap)[]
    exclude?: Node[]
  }
) {
  const { deps, events, exclude } = { events: ["click"], ...opts }
  useEffect(() => {
    const detectClick = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      console.log(exclude)
      if (exclude && exclude.some((n) => n && e.target && n.contains(e.target)))
        return
      onClickOutside(e)
    }
    events.forEach((evt) => document.addEventListener(evt, detectClick))
    return () => {
      events.forEach((evt) => document.removeEventListener(evt, detectClick))
    }
  }, deps)
}
