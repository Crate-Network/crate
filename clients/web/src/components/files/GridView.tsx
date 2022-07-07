import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "preact/hooks"
import useClickOutside from "hooks/useClickOutside"
import RightClickMenu from "./RightClickMenu"
import Anchor from "models/Anchor"
import { useFileStore, VisibleFiles } from "store/FileStore"
import shallow from "zustand/shallow"
import { FileModel } from "@crate/api-lib"
import { useStore as useFVStore } from "store/FileViewStore"

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
  const renameFile = useFileStore((state) => state.rename)
  const [selection, select, deselect] = useFVStore(
    (state) => [state.selectedFiles, state.select, state.deselect],
    shallow
  )
  const [editingName, setEditingName] = useState(false)

  const iconRef = useRef()
  const selected = selection.includes(file.name)

  const setSelected = (e) => select(file.name, !e.ctrlKey && !e.metaKey)

  const [anchorPos, setAnchorPos] = useState<null | Anchor>(null)
  const contextShown = Boolean(anchorPos)
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    if (!selection.includes(file.name)) select(file.name, true)
    setAnchorPos({ top: e.pageY, left: e.pageX })
  }

  const handleClose = (e) => {
    setAnchorPos(null)
  }

  useClickOutside(
    iconRef,
    (e) => {
      if (e.ctrlKey || e.metaKey || anchorPos !== null) return
      deselect(file.name)
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
          if (file.type === "file" && !editingName)
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
            icon={file.type === "file" ? faFile : faFolder}
            className="w-16 h-16 m-2"
            color="rgb(249,115,22)"
          />
        </div>
        {editingName ? (
          <NameInput
            oldName={file.name}
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
            {file.name.split(".")[0]}
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

export function GridView({ files }: { files: VisibleFiles }) {
  return (
    <div className="mt-8 p-2 sm:p-4 md:p-8 shadow-sm bg-white dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700">
      {Object.values(files).length === 0 ? (
        <div className="w-full text-center italic">
          This directory is empty.
        </div>
      ) : (
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
          }}
        >
          {Object.values(files).map((el) => (
            <FileIcon file={el} />
          ))}
        </div>
      )}
    </div>
  )
}
