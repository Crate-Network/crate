import { Inputs, MutableRef, useEffect } from "preact/hooks"

export default function useClickOutside(
  ref: MutableRef<HTMLElement>,
  onClickOutside: (e: MouseEvent) => void,
  deps: Inputs
) {
  useEffect(() => {
    const detectClick = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      onClickOutside(e)
    }
    document.addEventListener("click", detectClick)
    return () => {
      document.removeEventListener("click", detectClick)
    }
  }, deps)
}
