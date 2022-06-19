import useClickOutside from "hooks/useClickOutside"
import Anchor from "models/Anchor"
import { FileModel } from "@crate/common"
import { useContext, useRef, useState } from "preact/hooks"
import { FilesPageContext } from "../../pages/Files"
import RightClickMenu from "./RightClickMenu"
import { useFileStore } from "store/FileStore"

export function FileRow({ file }: { file: FileModel }) {
  const { selection, dispatchSelection } = useContext(FilesPageContext)
  const rowRef = useRef()
  const selected = selection.includes(file.fullName)

  const setSelected = (e) => {
    if (e.ctrlKey || e.metaKey) {
      dispatchSelection({ t: "add", id: file.fullName })
      return
    }
    dispatchSelection({ t: "setone", id: file.fullName })
  }

  useClickOutside(
    rowRef,
    (e) => {
      if (e.ctrlKey || e.metaKey || anchorPos !== null) return
      dispatchSelection({ t: "remove", id: file.fullName })
    },
    {
      deps: [selected],
      exclude: [
        document.getElementById("file-toolbar"),
        document.getElementById("file-inspector"),
      ],
    }
  )

  const [anchorPos, setAnchorPos] = useState<null | Anchor>(null)
  const contextShown = Boolean(anchorPos)
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setAnchorPos({ top: e.pageY, left: e.pageX })
    if (!selection.includes(file.fullName))
      dispatchSelection({ t: "setone", id: file.fullName })
  }
  const handleClose = () => {
    setAnchorPos(null)
  }

  return (
    <>
      <tr
        onClick={setSelected}
        onContextMenu={onContextMenu}
        className={`border-b border-opacity-30 ${
          selected
            ? "bg-orange-500 text-white"
            : "hover:bg-neutral-200 active:bg-neutral-300"
        } select-none cursor-pointer`}
      >
        <td className="p-2 pb-1 pt-1">{file.name}</td>
        <td></td>
        <td></td>
      </tr>

      {contextShown && (
        <RightClickMenu file={file} close={handleClose} anchor={anchorPos} />
      )}
    </>
  )
}

export function ListView() {
  const files = useFileStore((state) => state.files)
  return (
    <div className="mt-8 shadow-sm bg-white dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700">
      <table className="min-w-full text-left">
        <thead className="border-b border-opacity-30">
          <tr>
            <th className="p-2" scope="col">
              File Name
            </th>
            <th className="p-2" scope="col">
              Date
            </th>
            <th className="p-2" scope="col">
              Size
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.values(files).map((file) => (
            <FileRow file={file} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
