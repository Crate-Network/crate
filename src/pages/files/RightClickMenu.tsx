import { IconProp } from "@fortawesome/fontawesome-svg-core"
import useClickOutside from "hooks/useClickOutside"
import Anchor from "models/Anchor"
import { FileModel } from "models/FileModel"
import { useRef, useState } from "preact/hooks"

type RightClickMenuProps = {
  file: FileModel
  close: () => void
  anchor: Anchor
}

type SelectionOptions = {
  name: string
  func: () => void
  icon?: IconProp
}

const getSelectionOptions = (
  file: FileModel,
  close: () => void
): (SelectionOptions | "divider")[] => {
  const opt = (name: string, f?: () => void, icon?: IconProp) => {
    return {
      name,
      func: () => {
        if (f) f()
        close()
      },
      icon,
    }
  }

  return [
    opt("Open"),
    opt("Download"),
    "divider",
    opt("Delete"),
    "divider",
    opt("Inspect"),
    opt("Rename"),
    opt("Copy CID"),
    "divider",
    opt("Share"),
  ]
}

export default function RightClickMenu({
  file,
  close,
  anchor,
}: RightClickMenuProps) {
  const divRef = useRef()
  useClickOutside(divRef, close, { events: ["click", "contextmenu"] })
  const { left, top } = anchor
  return (
    <div
      ref={divRef}
      className="flex flex-col p-1 shadow-md text-sm dark:border-slate-800 rounded-md absolute w-48 backdrop-blur-lg bg-white dark:bg-slate-900 bg-opacity-40 dark:bg-opacity-50"
      style={{ left, top }}
      onContextMenu={close}
    >
      {getSelectionOptions(file, close).map((e) => {
        if (e === "divider") {
          return (
            <span className="mx-1 bg-slate-500 dark:bg-slate-300 h-px my-1 bg-opacity-20 rounded-sm" />
          )
        } else {
          const { name, func, icon } = e
          return (
            <span
              className="px-3 py-1 hover:bg-orange-400 hover:text-white rounded-md cursor-pointer"
              onClick={e.func}
            >
              {name}
            </span>
          )
        }
      })}
    </div>
  )
}
