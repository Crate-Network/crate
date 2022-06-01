import useClickOutside from "hooks/useClickOutside"
import Anchor from "models/Anchor"
import { FileModel } from "models/FileModel"
import { useContext, useRef, useState } from "preact/hooks"
import { FileViewProps, FilesPageContext } from "../Files"
import RightClickMenu from "./RightClickMenu"

export function FileRow({ file }: { file: FileModel }) {
  const { selection, dispatchSelection } = useContext(FilesPageContext)
  const rowRef = useRef()
  const selected = selection.includes(file.id)

  const setSelected = (e) => {
    if (e.ctrlKey || e.metaKey) {
      dispatchSelection({ t: "add", id: file.id })
      return
    }
    dispatchSelection({ t: "setone", id: file.id })
  }

  useClickOutside(
    rowRef,
    (e) => {
      if (e.ctrlKey || e.metaKey) return
      dispatchSelection({ t: "remove", id: file.id })
    },
    { deps: [selected] }
  )

  const [anchorPos, setAnchorPos] = useState<null | Anchor>(null)
  const contextShown = Boolean(anchorPos)
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setAnchorPos({ top: e.pageY, left: e.pageX })
    if (!selection.includes(file.id))
      dispatchSelection({ t: "setone", id: file.id })
  }
  const handleClose = () => {
    setAnchorPos(null)
  }

  return (
    <>
      <tr
        onClick={setSelected}
        onContextMenu={onContextMenu}
        className="border-b border-opacity-30 hover:bg-slate-200 active:bg-slate-300 select-none cursor-pointer"
      >
        <td>{file.name}</td>
        <td></td>
        <td></td>
      </tr>

      {contextShown && (
        <RightClickMenu file={file} close={handleClose} anchor={anchorPos} />
      )}
    </>
  )
}

export function ListView({ files }: FileViewProps) {
  return (
    <div className="mt-8 shadow-sm bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
      <table className="min-w-full text-left">
        <thead className="border-b border-opacity-30">
          <tr>
            <th scope="col">File Name</th>
            <th scope="col">Date</th>
            <th scope="col">Size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <FileRow file={file} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
