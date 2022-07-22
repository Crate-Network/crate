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
import useStoredState from "../hooks/useStoredState"
import { FileInspector } from "../components/files/FileInspector"
import {
  createStore as createFVStore,
  useStore as useFVStore,
  Provider as FVProvider,
} from "../store/FileViewStore"
import { useUserStore } from "../store/UserStore"
import { useEffect, useState } from "preact/hooks"
import { joinPath, splitPath } from "@crate/common"
import { useFileStore } from "../store/FileStore"
import { NamedFileModel } from "@crate/types"
import DirectoryLoading from "../components/files/DirectoryLoading"

function Breadcrumbs() {
  const { path, setPath } = useFVStore()
  return (
    <div className="mb-4 font-bold text-sm text-neutral-700 dark:text-neutral-200">
      <button
        className="cursor-pointer hover:text-neutral-400 hover:underline"
        onClick={() => {
          setPath(joinPath("ipfs", splitPath(path)[0]))
        }}
      >
        All Files
      </button>
      {splitPath(path)
        .slice(1)
        .map((el, idx) => (
          <span key={el}>
            <span className="font-light inline-block ml-2 mr-2">&gt;</span>
            <button
              className="cursor-pointer hover:text-neutral-400 hover:underline"
              onClick={() => {
                setPath(joinPath("ipfs", ...splitPath(path).slice(0, idx + 2)))
              }}
            >
              {el}
            </button>
          </span>
        ))}
    </div>
  )
}

function FilesChild() {
  const { inspectorVisible, hideInspector, path, setPath, setLoading } =
    useFVStore()
  const rootCID = useUserStore((state) => state.userDoc.rootCID)

  useEffect(() => {
    const pathArr = splitPath(path)
    const currentRootCID = pathArr[0]
    if (rootCID !== currentRootCID) {
      pathArr[0] = rootCID
      setPath(`/ipfs/${pathArr.join("/")}/`)
    }
  }, [path, rootCID, setPath])

  const { getChildren } = useFileStore()
  const [files, setFiles] = useState<Record<string, NamedFileModel>>({})

  useEffect(() => {
    setLoading(true)
    getChildren(path)
      .then((files) => {
        setLoading(false)
        setFiles(files)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [getChildren, path, setLoading])

  const [viewMode, setViewMode] = useStoredState<ViewMode>(
    ViewMode.LIST,
    "view-mode"
  )
  const [sortBy, setSortBy] = useStoredState<SortBy>(SortBy.NAME, "sort-order")

  const orderedFiles = Object.values(files).sort((a, b) => {
    switch (sortBy) {
      case SortBy.NAME:
        return a.name > b.name ? 1 : -1
      case SortBy.SIZE:
        return a.size < b.size ? 1 : -1
      default:
        return a.name > b.name ? 1 : -1
    }
  })

  return (
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
        {viewMode === ViewMode.LIST && <ListView files={orderedFiles} />}
        {viewMode === ViewMode.GRID && <GridView files={orderedFiles} />}
      </div>
      <div
        id="file-inspector"
        className={`bg-white overflow-x-hidden top-8 dark:bg-neutral-800 rounded-md shadow-md sm:mt-12 md:mt-16 lg:mt-20 ml-8 hidden lg:block lg:sticky transition-all duration-300 h-fit ${
          inspectorVisible ? "opacity-100 w-80" : "opacity-0 w-0"
        }`}
      >
        <div className="w-80">
          <FileInspector close={hideInspector} />
        </div>
      </div>
    </main>
  )
}

export default function Files() {
  const userRootCID = useUserStore((state) => state.userDoc?.rootCID)
  if (!userRootCID) return <DirectoryLoading />
  return (
    <FVProvider createStore={createFVStore(userRootCID)}>
      <FilesChild />
    </FVProvider>
  )
}
