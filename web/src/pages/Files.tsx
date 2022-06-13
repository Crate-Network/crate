import { FileModel } from "@crate/common"
import { createContext } from "preact"
import { useContext, useEffect, useReducer, useState } from "preact/hooks"
import { GridView } from "../components/files/GridView"
import { ListView } from "../components/files/ListView"
import {
  SearchBar,
  SortBar,
  SortBy,
  AddBox,
  ViewBar,
  ViewMode,
} from "../components/files/Toolbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCopy,
  faGreaterThan,
  faLessThan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import FileContext from "context/FileContext"
import { Link } from "preact-router"
import useStoredState from "hooks/useStoredState"

type SelectionType = "add" | "remove" | "setone"
type DispatchMethod = { t: SelectionType; id: string }
function selectionReducer(prev: string[], f: DispatchMethod) {
  const { id, t } = f
  switch (t) {
    case "setone":
      return [id]
    case "add":
      return prev.includes(id) ? prev : [...prev, id]
    case "remove":
      return prev.includes(id) ? prev.filter((e) => e !== id) : prev
    default:
      return prev
  }
}

export const FilesPageContext = createContext<{
  selection: string[]
  dispatchSelection: (a: DispatchMethod) => void
  showInspector: () => void
}>({ selection: [], dispatchSelection: () => null, showInspector: () => null })

export type FileViewProps = {
  files: FileModel[]
}

function FileInspectorFileBody({ file }) {
  const rows: [string, string, string?, boolean?][] = [
    ["Name", file.fullName],
    ["Extension", file.extension],
    ["Encrypted", file.encrypted.toString()],
    ["UID", file.id, "text-xs font-mono break-all", true],
    ["CID", file.cid, "text-xs font-mono break-all", true],
  ]
  return (
    <div className="p-2 text-sm">
      <table>
        {rows.map(([title, value, classes, copy]) => (
          <tr>
            <td className="font-semibold text-gray-600 dark:text-gray-300 text-right pr-4 align-top">
              {title}
            </td>
            <td className={typeof classes === "string" ? classes : ""}>
              {value}{" "}
              {copy && (
                <span
                  className="rounded-sm p-0.5 hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-600 dark:active:bg-neutral-700 transition-all dark:text-white cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(value)
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </span>
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}

function Breadcrumbs() {
  const path = ["folder1", "folder2"]
  return (
    <div className="mb-4 font-bold text-sm text-neutral-700 dark:text-neutral-200">
      <Link
        className="cursor-pointer hover:text-neutral-400 hover:underline"
        href="/"
      >
        All Files
      </Link>
      {path.map((el) => (
        <>
          <span className="font-light inline-block ml-2 mr-2">&gt;</span>
          <Link className="cursor-pointer hover:text-neutral-400 hover:underline">
            {el}
          </Link>
        </>
      ))}
    </div>
  )
}

function FileInspector({ close }: { close: () => void }) {
  const { selection } = useContext(FilesPageContext)
  const { files } = useContext(FileContext)
  const selectedFiles: FileModel[] = selection
    .map((id) => files.find((v) => v.id === id))
    .filter((v) => v !== undefined)
  const [fileIndex, setFileIndex] = useState(0)
  const maxIndex = selectedFiles.length - 1

  useEffect(() => {
    if (maxIndex < fileIndex) setFileIndex(maxIndex)
    if (fileIndex < 0) setFileIndex(0)
  }, [maxIndex, fileIndex])

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

export default function Files() {
  const { files } = useContext(FileContext)
  const [selection, dispatchSelection] = useReducer<string[], DispatchMethod>(
    selectionReducer,
    []
  )

  useEffect(() => {
    selection.forEach((v) => {
      if (files.some((f) => f.id === v)) return
      console.log("Removing " + v)
      dispatchSelection({ t: "remove", id: v })
    })
  }, [files])

  const [viewMode, setViewMode] = useStoredState<ViewMode>(
    ViewMode.LIST,
    "view-mode"
  )
  const [sortBy, setSortBy] = useStoredState<SortBy>(SortBy.NAME, "sort-order")
  const [showInspector, setShowInspector] = useState(false)

  return (
    <FilesPageContext.Provider
      value={{
        selection,
        dispatchSelection,
        showInspector: () => setShowInspector(true),
      }}
    >
      <main className="flex flex-row mx-auto 2xl:px-32 px-4 mt-6 sm:mt-12 md:mt-16 lg:mt-20 lg:px-8">
        <div className="grow">
          <h1 className="font-iaQuattro lg:text-5xl lg:mb-8 mb-3 text-4xl font-bold">
            Files
          </h1>
          <Breadcrumbs />
          <div
            id="file-toolbar"
            className="flex justify-between space-x-0 md:space-x-8 lg:space-x-24 2xl:space-x-48 flex-col md:flex-row"
          >
            <SearchBar />

            <div className="flex space-x-8 justify-end mt-4 md:mt-0">
              <AddBox />
              <SortBar sortBy={sortBy} setSortBy={setSortBy} />
              <ViewBar viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          {viewMode === ViewMode.LIST ? (
            <ListView files={files} />
          ) : (
            <GridView files={files} />
          )}
        </div>
        <div
          id="file-inspector"
          className={`bg-white overflow-x-hidden top-8 dark:bg-neutral-800 rounded-md shadow-md sm:mt-12 md:mt-16 lg:mt-20 ml-8 hidden lg:block lg:sticky transition-all duration-300 h-fit ${
            showInspector ? "opacity-100 w-80" : "opacity-0 w-0"
          }`}
        >
          <div className="w-80">
            <FileInspector
              close={() => {
                setShowInspector(false)
              }}
            />
          </div>
        </div>
      </main>
    </FilesPageContext.Provider>
  )
}
