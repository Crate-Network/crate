import useClickOutside from "../../hooks/useClickOutside"
import Anchor from "../../models/Anchor"
import { useRef, useState } from "preact/hooks"
import RightClickMenu from "./RightClickMenu"
import { useFileStore } from "../../store/FileStore"
import shallow from "zustand/shallow"
import { useStore as useFVStore } from "../../store/FileViewStore"
import { FileModel } from "@crate/types"

export function FileRow({ file }: { file: FileModel }) {
  const [selection, select, deselect] = useFVStore(
    (state) => [state.selectedNames(), state.select, state.deselect],
    shallow
  )
  const rowRef = useRef()
  const selected = selection.includes(file.name)

  const selectionInfo = { name: file.name, cid: file.cid }

  const setSelected = (e) => select(selectionInfo, !e.ctrlKey && !e.metaKey)
  useClickOutside(
    rowRef,
    (e) => {
      if (e.ctrlKey || e.metaKey || anchorPos !== null) return
      deselect(selectionInfo)
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
    if (!selection.includes(file.name)) select(selectionInfo, true)
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
        <td />
        <td />
      </tr>

      {contextShown && (
        <RightClickMenu close={handleClose} anchor={anchorPos} />
      )}
    </>
  )
}

export function ListView() {
  const path = useFVStore((state) => state.path)
  const getChildren = useFileStore((state) => state.getChildren)
  const files = getChildren(path)
  return (
    <div className="mt-8 shadow-sm bg-white dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700">
      {Object.values(files).length === 0 ? (
        <div className="text-center italic w-full p-2 sm:p-4 md:p-8">
          This directory is empty.
        </div>
      ) : (
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
              <FileRow file={file} key={file.name} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
