import { useEffect, useState } from "preact/hooks"
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
import { useFileStore, VisibleFiles } from "store/FileStore"
import { FileInspector } from "../components/files/FileInspector"
import shallow from "zustand/shallow"
import {
  createStore as createFVStore,
  useStore as useFVStore,
  Provider as FVProvider,
} from "store/FileViewStore"
import { useUserStore } from "store/UserStore"

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
        <span key={el}>
          <span className="font-light inline-block ml-2 mr-2">&gt;</span>
          <Link className="cursor-pointer hover:text-neutral-400 hover:underline">
            {el}
          </Link>
        </span>
      ))}
    </div>
  )
}

function FilesChild() {
  const files = useFileStore((state) => state.files)
  const [signedIn, userDoc, authenticating] = useUserStore(
    (state) => [state.signedIn, state.userDoc, state.authenticating],
    shallow
  )
  const getContents = useFileStore((state) => state.getContents)
  const {
    deselect,
    selectedFiles,
    inspectorVisible,
    hideInspector,
    visible,
    show,
  } = useFVStore()

  useEffect(() => {
    if (userDoc.rootCID !== "") show(userDoc.rootCID)
  }, [show, userDoc.rootCID])

  useEffect(() => {
    selectedFiles.forEach((v) => {
      if (v in files) return
      deselect(v)
    })
  }, [deselect, files, selectedFiles])

  const [viewMode, setViewMode] = useStoredState<ViewMode>(
    ViewMode.LIST,
    "view-mode"
  )

  const ready = visible !== "" && signedIn && !authenticating
  const [sortBy, setSortBy] = useStoredState<SortBy>(SortBy.NAME, "sort-order")

  const [visibleFiles, setVisibleFiles] = useState<VisibleFiles>(null)
  const noFiles = !ready || !visibleFiles
  useEffect(() => {
    if (ready) getContents(visible).then((vFiles) => setVisibleFiles(vFiles))
  }, [getContents, ready, visible])

  const loading = !ready || noFiles

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
        {loading && (
          <div className="w-full text-center italic mt-8">
            Loading your files...
          </div>
        )}
        {!noFiles && viewMode === ViewMode.LIST && (
          <ListView files={visibleFiles} />
        )}
        {!noFiles && viewMode === ViewMode.GRID && (
          <GridView files={visibleFiles} />
        )}
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
  return (
    <FVProvider createStore={createFVStore}>
      <FilesChild />
    </FVProvider>
  )
}
