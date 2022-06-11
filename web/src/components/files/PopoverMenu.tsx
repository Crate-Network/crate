import useClickOutside from "hooks/useClickOutside"
import Anchor from "models/Anchor"
import { useEffect, useRef, useState } from "preact/hooks"
import { JSXInternal } from "preact/src/jsx"

export type SelectionOptions = {
  name: string
  func: (e: MouseEvent) => void
}

export type PopoverMenuProps = {
  close: (e: MouseEvent) => void
  anchor: Anchor
} & JSXInternal.HTMLAttributes<HTMLDivElement>

export type PopoverMenuItems = {
  opts: (SelectionOptions | "divider")[]
}

export function PopoverMenu({
  close,
  anchor,
  opts,
  ...props
}: PopoverMenuItems & PopoverMenuProps) {
  const divRef = useRef<HTMLDivElement>()
  useClickOutside(divRef, close, { events: ["click", "contextmenu"] })
  const [adjAnchor, setAnchor] = useState<Anchor>(anchor)
  const { left, top } = adjAnchor

  useEffect(() => {
    if (!divRef.current) return
    const { offsetHeight, offsetWidth } = divRef.current
    const { scrollTop, scrollLeft, clientHeight, clientWidth } =
      document.documentElement
    const docBottom = scrollTop + clientHeight
    const menuBottom = top + offsetHeight
    const docRight = scrollLeft + clientWidth
    const menuRight = left + offsetWidth
    setAnchor({
      top: top - (menuBottom > docBottom ? menuBottom - docBottom : 0),
      left: left - (menuRight > docRight ? menuRight - docRight : 0),
    })
  }, [anchor])

  const [initialMenuScale, setInitialMenuScale] = useState<boolean>(false)
  useEffect(() => {
    setInitialMenuScale(true)
  }, [])

  return (
    <div
      ref={divRef}
      className={`flex flex-col p-1 z-20 transition-all shadow-md text-sm dark:border-neutral-800 rounded-md absolute w-48 backdrop-blur-lg bg-white dark:bg-neutral-900 bg-opacity-40 dark:bg-opacity-50 select-none ${
        initialMenuScale ? "" : "-translate-x-1/2 -translate-y-1/2 scale-0"
      }`}
      style={{ left, top }}
      onContextMenu={close}
      {...props}
    >
      {opts.map((e) => {
        if (e === "divider") {
          return (
            <span className="mx-1 bg-neutral-500 dark:bg-neutral-300 h-px my-1 bg-opacity-20 rounded-sm" />
          )
        } else {
          const { name, func } = e
          return (
            <span
              className="px-3 py-1 hover:bg-orange-400 hover:text-white rounded-md cursor-pointer"
              onClick={func}
            >
              {name}
            </span>
          )
        }
      })}
    </div>
  )
}
