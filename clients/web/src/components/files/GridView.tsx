import { FilesPageContext } from "../../pages/Files"
import { faFile } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FileModel } from "@crate/common"
import { useContext, useEffect, useRef, useState } from "preact/hooks"
import useClickOutside from "hooks/useClickOutside"
import RightClickMenu from "./RightClickMenu"
import Anchor from "models/Anchor"
import { useFileStore } from "store/FileStore"

type IconState = "empty" | "selected" | "hovered"
const getIconState = (selected: boolean, hovered: boolean): IconState => {
  if (selected) return "selected"
  return hovered ? "hovered" : "empty"
}

function NameInput({
  oldName,
  onComplete,
  onCancel,
}: {
  oldName: string
  onComplete: (newName: string) => void
  onCancel: () => void
}) {
  const fiRef = useRef<HTMLInputElement>()
  const [val, setVal] = useState(oldName)

  useEffect(() => {
    if (!fiRef.current) return
    fiRef.current.focus()
  }, [])

  useEffect(() => {
    const keyPressListener = (e) => {
      if (e.key === "Escape") {
        onCancel()
      } else if (e.key === "Enter") {
        onComplete(val)
      }
    }
    document.addEventListener("keydown", keyPressListener)
    return () => document.removeEventListener("keydown", keyPressListener)
  }, [val])

  useClickOutside(
    fiRef,
    (e) => {
      if (!fiRef.current) return
      onComplete(val)
    },
    { deps: [val] }
  )

  return (
    <input
      className="text-sm h-5 text-center border-gray-500"
      type="text"
      ref={fiRef}
      value={val}
      autoFocus={true}
      onInput={(e) => {
        if (e && e.target) setVal((e.target as any).value)
      }}
    />
  )
}

function FileIcon({ file }: { file: FileModel }) {
  const [hovered, setHovered] = useState(false)
  const { selection, dispatchSelection } = useContext(FilesPageContext)
  const renameFile = useFileStore((state) => state.renameFile)
  const [editingName, setEditingName] = useState(false)

  const iconRef = useRef()
  const selected = selection.includes(file.fullName)

  const setSelected = (e) => {
    if (e.ctrlKey || e.metaKey) {
      dispatchSelection({ t: "add", id: file.fullName })
      return
    }
    dispatchSelection({ t: "setone", id: file.fullName })
  }

  const [anchorPos, setAnchorPos] = useState<null | Anchor>(null)
  const contextShown = Boolean(anchorPos)
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    if (!selection.includes(file.fullName))
      dispatchSelection({ t: "setone", id: file.fullName })
    setAnchorPos({ top: e.pageY, left: e.pageX })
  }

  const handleClose = (e) => {
    setAnchorPos(null)
  }

  useClickOutside(
    iconRef,
    (e) => {
      if (e.ctrlKey || e.metaKey || anchorPos !== null) return
      dispatchSelection({ t: "remove", id: file.fullName })
    },
    {
      deps: [selected, anchorPos],
      exclude: [
        document.getElementById("file-toolbar"),
        document.getElementById("file-inspector"),
      ],
    }
  )

  const iconState = getIconState(selected || editingName, hovered)
  return (
    <>
      <div
        className="flex flex-col justify-center items-center w-36 h-36 select-none"
        onClick={setSelected}
        onDblClick={() => {
          window.open("https://crate.network/ipfs/" + file.cid, "_blank")
        }}
        onContextMenu={onContextMenu}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        ref={iconRef}
      >
        <div
          className={"flex justify-center items-center rounded-md m-1 w-24 h-24 ".concat(
            iconState === "hovered" ? "bg-opacity-10 bg-neutral-500 " : "",
            iconState === "selected" ? "bg-opacity-40 bg-neutral-500 " : ""
          )}
        >
          <FontAwesomeIcon
            icon={faFile}
            className="w-16 h-16 m-2"
            color="rgb(249,115,22)"
          />
        </div>
        {editingName ? (
          <NameInput
            oldName={file.fullName}
            onCancel={() => {
              setEditingName(false)
            }}
            onComplete={(newName) => {
              setEditingName(false)
              if (newName === "") return
              renameFile(file, newName)
            }}
          />
        ) : (
          <span
            className={"px-1 font-medium text-sm rounded-md select-text ".concat(
              iconState === "hovered" ? "bg-opacity-10 bg-neutral-500 " : "",
              iconState === "selected" ? "bg-orange-500 text-white " : ""
            )}
          >
            {file.name}
          </span>
        )}
      </div>
      {contextShown && (
        <RightClickMenu
          close={handleClose}
          anchor={anchorPos}
          onRenameRequest={() => setEditingName(true)}
        />
      )}
    </>
  )
}

export function GridView() {
  const files = useFileStore((state) => state.files)
  return (
    <div className="mt-8 p-2 sm:p-4 md:p-8 shadow-sm bg-white dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700">
      <div
        className="grid w-full"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))" }}
      >
        {Object.values(files).map((el) => (
          <FileIcon file={el} />
        ))}
      </div>
    </div>
  )
}
