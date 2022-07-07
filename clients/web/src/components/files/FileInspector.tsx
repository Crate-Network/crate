import { useContext, useEffect, useState } from "preact/hooks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGreaterThan,
  faLessThan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { useFileStore, VisibleFiles } from "store/FileStore"
import { FileInspectorFileBody } from "components/files/FileInspectorFileBody"
import { useStore as useFVStore } from "store/FileViewStore"

export function FileInspector({ close }: { close: () => void }) {
  const selection = useFVStore((state) => state.selectedFiles)
  const visible = useFVStore((state) => state.visible)
  const getContents = useFileStore((state) => state.getContents)
  const [files, setFiles] = useState<VisibleFiles>()

  // self-executing async function
  useEffect(() => {
    ;(async () => {
      const files: VisibleFiles = await getContents(visible)
      setFiles(files)
    })()
  }, [])

  const directory = useFileStore((state) => state.files[visible])
  const selectedFiles =
    selection.length > 0 && files
      ? selection.map((name) => files[name]).filter((v) => v !== undefined)
      : [directory]

  const [fileIndex, setFileIndex] = useState(0)
  const maxIndex = selectedFiles.length - 1
  useEffect(() => {
    if (maxIndex < fileIndex) setFileIndex(maxIndex)
    if (fileIndex < 0) setFileIndex(0)
  }, [maxIndex, fileIndex])

  if (!files) return null

  return (
    <>
      <div className="flex flex-row items-center justify-between border-b">
        <h2 className="font-iaQuattro text-xl font-bold ml-2">Inspector</h2>
        <button
          onClick={close}
          className="bg-orange-500 h-8 w-8 m-2 rounded-md hover:shadow-lg active:shadow-md text-white transition-shadow"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      {selectedFiles.length === 1 && (
        <FileInspectorFileBody file={selectedFiles[0]} />
      )}
      {selectedFiles.length > 1 && (
        <>
          <FileInspectorFileBody file={selectedFiles[fileIndex]} />
          <div className="flex justify-center items-center">
            <button
              disabled={fileIndex === 0}
              onClick={() => setFileIndex((i) => i - 1)}
              className="bg-neutral-500 select-none disabled:bg-neutral-200 dark:disabled:bg-neutral-800 hover:bg-neutral-600 active:bg-neutral-700 transition-all rounded-md shadow-sm h-8 w-8 text-white"
            >
              <FontAwesomeIcon icon={faLessThan} />
            </button>
            <span className="font-bold m-2 italic inline-block w-12 text-center">
              {fileIndex + 1} / {maxIndex + 1}
            </span>
            <button
              disabled={fileIndex === maxIndex}
              onClick={() => setFileIndex((i) => i + 1)}
              className="bg-neutral-500 select-none disabled:bg-neutral-200 dark:disabled:bg-neutral-800 hover:bg-neutral-600 active:bg-neutral-700 transition-all rounded-md shadow-sm h-8 w-8 text-white"
            >
              <FontAwesomeIcon icon={faGreaterThan} />
            </button>
          </div>
        </>
      )}
      {selectedFiles.length === 0 && (
        <span className="text-sm m-2 italic inline-block">
          No files are selected.
        </span>
      )}
    </>
  )
}
