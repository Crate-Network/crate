import { FileModel } from "models/FileModel"
import { createContext } from "preact"
import {
  StateUpdater,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "preact/hooks"
import { GridView } from "./files/GridView"
import { ListView } from "./files/ListView"
import { SearchBar, UploadButton, ViewBar, ViewMode } from "./files/Toolbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy, faXmark } from "@fortawesome/free-solid-svg-icons"
import FileContext from "context/FileContext"

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
    ["Name", file.name],
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
                  className="rounded-sm p-0.5 hover:bg-slate-300 active:bg-slate-400 dark:hover:bg-slate-600 dark:active:bg-slate-700 transition-all dark:text-white cursor-pointer"
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

function FileInspector({ close }: { close: () => void }) {
  const { selection } = useContext(FilesPageContext)
  const { files } = useContext(FileContext)
  const selectedFiles = selection.map((id) => files.find((v) => v.id === id))

  return (
    <div className="w-72">
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
        <span className="text-sm m-2 italic inline-block">
          Multiple files are selected.
        </span>
      )}
      {selectedFiles.length === 0 && (
        <span className="text-sm m-2 italic inline-block">
          No files are selected.
        </span>
      )}
    </div>
  )
}

export default function Files() {
  const [selection, dispatchSelection] = useReducer<string[], DispatchMethod>(
    selectionReducer,
    []
  )
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST)
  const [showInspector, setShowInspector] = useState(false)

  const { files } = useContext(FileContext)

  return (
    <FilesPageContext.Provider
      value={{
        selection,
        dispatchSelection,
        showInspector: () => setShowInspector(true),
      }}
    >
      <main className="flex flex-row mx-auto max-w-7xl px-4 mt-6 sm:mt-12 md:mt-16 lg:mt-20 lg:px-8">
        <div className="grow">
          <h1 className="font-iaQuattro lg:text-5xl lg:mb-8 mb-3 text-4xl font-bold">
            Files
          </h1>
          <div id="file-toolbar" className="flex justify-between">
            <SearchBar />
            <ViewBar viewMode={viewMode} setViewMode={setViewMode} />
            <UploadButton />
          </div>

          {viewMode === ViewMode.LIST ? (
            <ListView files={files} />
          ) : (
            <GridView files={files} />
          )}
        </div>
        <div
          id="file-inspector"
          className={`bg-white top-8 dark:bg-slate-800 rounded-md shadow-md sm:mt-12 md:mt-16 lg:mt-20 ml-8 hidden lg:sticky lg:block transition-all h-fit ${
            showInspector ? "w-72 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <FileInspector
            close={() => {
              setShowInspector(false)
            }}
          />
        </div>
      </main>
    </FilesPageContext.Provider>
  )
}
