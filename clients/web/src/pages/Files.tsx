import { FileModel } from "@crate/common"
import { createContext } from "preact"
import { useEffect, useReducer, useState } from "preact/hooks"
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
import { Link } from "preact-router"
import useStoredState from "hooks/useStoredState"
import { useFileStore } from "store/FileStore"
import { FileInspector } from "../components/files/FileInspector"

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

export const FilesPageContext = createContext<{
  selection: string[]
  dispatchSelection: (a: DispatchMethod) => void
  inspect: (files?: FileModel[]) => void
}>({ selection: [], dispatchSelection: () => null, inspect: () => null })

export default function Files() {
  const files = useFileStore((state) => state.files)
  const [selection, dispatchSelection] = useReducer<string[], DispatchMethod>(
    selectionReducer,
    []
  )

  useEffect(() => {
    selection.forEach((v) => {
      if (v in files) return
      dispatchSelection({ t: "remove", id: v })
    })
  }, [files])

  const inspect = () => setShowInspector(true)
  const [viewMode, setViewMode] = useStoredState<ViewMode>(
    ViewMode.LIST,
    "view-mode"
  )
  const [sortBy, setSortBy] = useStoredState<SortBy>(SortBy.NAME, "sort-order")
  const [showInspector, setShowInspector] = useState(false)

  const noFiles = Object.values(files).length === 0

  return (
    <FilesPageContext.Provider
      value={{
        selection,
        dispatchSelection,
        inspect,
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
          {noFiles && (
            <div className="w-full text-center italic mt-8">No files yet!</div>
          )}
          {!noFiles && viewMode === ViewMode.LIST && <ListView />}
          {!noFiles && viewMode === ViewMode.GRID && <GridView />}
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
