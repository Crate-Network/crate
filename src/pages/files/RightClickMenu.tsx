import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FileContext from "context/FileContext"
import useClickOutside from "hooks/useClickOutside"
import Anchor from "models/Anchor"
import { FileEventListeners, FileModel } from "models/FileModel"
import { FileAction } from "models/FileMutator"
import { FilesPageContext } from "pages/Files"
import { useContext, useRef } from "preact/hooks"
import { JSXInternal } from "preact/src/jsx"

type RightClickMenuProps = {
  file: FileModel
  close: (e: MouseEvent) => void
  anchor: Anchor
} & FileEventListeners

type SelectionOptions = {
  name: string
  func: (e: MouseEvent) => void
}

export default function RightClickMenu({
  file,
  close,
  anchor,
  onRenameRequest,
  onDelete,
  ...props
}: RightClickMenuProps & JSXInternal.HTMLAttributes<HTMLDivElement>) {
  const divRef = useRef()
  useClickOutside(divRef, close, { events: ["click", "contextmenu"] })
  const { left, top } = anchor
  const { showInspector, dispatchSelection } = useContext(FilesPageContext)

  const mOpt = (name: string, f?: () => void, hide: boolean = false) =>
    hide
      ? "none"
      : {
          name,
          func: (e: MouseEvent) => {
            if (f) f()
            close(e)
          },
        }

  const opts: (SelectionOptions | "divider" | "none")[] = [
    mOpt("Open"),
    mOpt("Download"),
    "divider",
    mOpt("Delete"),
    "divider",
    mOpt("Inspect", () => {
      showInspector()
      dispatchSelection({ t: "setone", id: file.id })
    }),
    mOpt("Rename", onRenameRequest, !onRenameRequest),
    mOpt("Copy CID"),
    "divider",
    mOpt("Share"),
  ]

  return (
    <div
      ref={divRef}
      className="flex flex-col p-1 shadow-md text-sm dark:border-slate-800 rounded-md absolute w-48 backdrop-blur-lg bg-white dark:bg-slate-900 bg-opacity-40 dark:bg-opacity-50"
      style={{ left, top }}
      onContextMenu={close}
      {...props}
    >
      {opts.map((e) => {
        if (e === "divider") {
          return (
            <span className="mx-1 bg-slate-500 dark:bg-slate-300 h-px my-1 bg-opacity-20 rounded-sm" />
          )
        } else if (e !== "none") {
          const { name, func } = e
          return (
            <span
              className="px-3 py-1 hover:bg-orange-400 hover:text-white rounded-md cursor-pointer"
              onClick={func}
            >
              {name}
            </span>
          )
        } else return null
      })}
    </div>
  )
}
