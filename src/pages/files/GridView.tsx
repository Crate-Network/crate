import { FileViewProps, SelectionContext } from "../Files"
import { faFile } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FileModel } from "models/FileModel"
import { useContext, useRef, useState } from "preact/hooks"
import useClickOutside from "hooks/useClickOutside"

enum IconState {
  EMPTY,
  HOVERED,
  SELECTED,
}

function FileIcon({ file }: { file: FileModel }) {
  const [hovered, setHovered] = useState(false)
  const [selection, dispatchSelection] = useContext(SelectionContext)
  const iconRef = useRef()
  const selected = selection.includes(file.id)

  const setSelected = (e) => {
    if (e.ctrlKey || e.metaKey) {
      dispatchSelection({ t: "add", id: file.id })
      return
    }
    dispatchSelection({ t: "setone", id: file.id })
  }

  const getIconState = () => {
    if (selected) return IconState.SELECTED
    return hovered ? IconState.HOVERED : IconState.EMPTY
  }

  useClickOutside(
    iconRef,
    (e) => {
      if (e.ctrlKey || e.metaKey) return
      dispatchSelection({ t: "remove", id: file.id })
    },
    [selected]
  )

  const iconState = getIconState()
  return (
    <div
      className={"flex flex-col justify-center items-center w-36 h-36"}
      onClick={setSelected}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      ref={iconRef}
    >
      <div
        className={"flex justify-center items-center rounded-md m-1 w-24 h-24 ".concat(
          iconState === IconState.HOVERED
            ? "bg-opacity-10 bg-neutral-500 "
            : "",
          iconState === IconState.SELECTED
            ? "bg-opacity-40 bg-neutral-500 "
            : ""
        )}
      >
        <FontAwesomeIcon
          icon={faFile}
          className="w-16 h-16 m-2"
          color="rgb(249,115,22)"
        />
      </div>
      <span
        className={"px-1 font-medium text-sm rounded-md ".concat(
          iconState === IconState.HOVERED
            ? "bg-opacity-10 bg-neutral-500 "
            : "",
          iconState === IconState.SELECTED ? "bg-orange-500 text-white " : ""
        )}
      >
        FileName
      </span>
    </div>
  )
}

export function GridView({ files }: FileViewProps) {
  return (
    <div
      className="grid w-full"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))" }}
    >
      {files.map((el) => (
        <FileIcon file={el} />
      ))}
    </div>
  )
}
