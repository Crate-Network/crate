import { FileModel } from "models/FileModel"
import { createContext } from "preact"
import { useContext, useReducer, useState } from "preact/hooks"
import { GridView } from "./files/GridView"
import { ListView } from "./files/ListView"
import { SearchBar, UploadButton, ViewBar, ViewMode } from "./files/Toolbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
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

export const SelectionContext = createContext<
  [string[], (a: DispatchMethod) => void]
>([[], () => null])

export type FileViewProps = {
  files: FileModel[]
}

export default function Files() {
  const [selection, dispatchSelect] = useReducer<string[], DispatchMethod>(
    selectionReducer,
    []
  )
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST)
  const [fileToInspect, inspect] = useState<null | FileModel>(null)
  const inspectorActive = Boolean(fileToInspect)
  const { files } = useContext(FileContext)
  return (
    <SelectionContext.Provider value={[selection, dispatchSelect]}>
      <main className="flex flex-row mx-auto max-w-7xl px-4 mt-6 sm:mt-12 md:mt-16 lg:mt-20 lg:px-8 overflow-hidden">
        <div className="grow">
          <h1 className="font-iaQuattro lg:text-5xl lg:mb-8 mb-3 text-4xl font-bold">
            Files
          </h1>
          <div className="flex justify-between">
            <SearchBar />
            <ViewBar viewMode={viewMode} setViewMode={setViewMode} />
            <UploadButton />
          </div>
          <div className="mt-8 p-2 sm:p-4 md:p-8 shadow-sm bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            {viewMode === ViewMode.LIST ? (
              <ListView files={files} />
            ) : (
              <GridView files={files} />
            )}
          </div>
        </div>
        <div
          className={`bg-white dark:bg-slate-800 rounded-md shadow-md sm:mt-12 md:mt-16 lg:mt-20 ml-8 hidden lg:block transition-all overflow-hidden h-fit ${
            inspectorActive ? "w-56" : "w-0"
          }`}
        >
          <div className="flex flex-row items-center justify-between border-b w-56">
            <h2 className="font-iaQuattro text-xl font-bold ml-2">Inspector</h2>
            <button
              onClick={() => inspect(null)}
              className="bg-orange-500 h-8 w-8 m-2 rounded-md hover:shadow-lg active:shadow-md text-white transition-shadow"
            >
              <FontAwesomeIcon icon={faXmark} />
              {fileToInspect && <span>{fileToInspect.id}</span>}
            </button>
          </div>
          <div className="p-2">Options</div>
        </div>
      </main>
    </SelectionContext.Provider>
  )
}
