import { faUpload, faGrip, faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "components/Button"
import FormInput from "components/FormInput"
import { StateUpdater, useRef } from "preact/hooks"
import { JSXInternal } from "preact/src/jsx"
import Dropdown from "./Dropdown"

export function UploadButton() {
  const input = useRef(null)
  const onUpload = async (e) => {
    const fileInput: HTMLInputElement = e.target
    const { files } = fileInput
    if (!files) return

    const fileArr: {
      path: string
      content: Uint8Array
    }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      fileArr.push({
        path: "/" + file.name,
        content: new Uint8Array(await file.arrayBuffer()),
      })
    }

    // for await (const entry of importer(fileArr, blockstore)) {
    //   console.info(entry)
    // }
  }

  const onStartUpload = (e) => {
    if (!input.current) return
    input.current.click()
  }
  return (
    <div className="flex flex-col justify-between">
      <label
        htmlFor="search"
        className="text-sm font-medium text-gray-700 dark:text-gray-400"
      >
        Upload
      </label>
      <Button
        className="font-medium text-neutral-50 rounded-md hover:text-neutral-300 bg-neutral-400 dark:bg-neutral-600 w-32 h-10"
        type="button"
        id="upload-button"
        onClick={onStartUpload}
      >
        <FontAwesomeIcon icon={faUpload} />
        &nbsp;&nbsp;&nbsp;Upload
      </Button>
      <input
        className="hidden"
        type="file"
        ref={input}
        onChangeCapture={onUpload}
        multiple
      />
    </div>
  )
}

export function SearchBar() {
  return (
    <div className="flex-1 flex-col justify-between">
      <label
        htmlFor="search"
        className="text-sm font-medium text-gray-700 dark:text-gray-400"
      >
        Search
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <FormInput
          type="text"
          name="search"
          id="search"
          placeholder="textfile.txt"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            className="btn px-6 h-full bg-orange-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-orange-600 hover:shadow-lg focus:bg-orange-600  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-orange-700 active:shadow-lg transition duration-150 ease-in-out flex items-center"
            type="button"
            id="search-button"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="search"
              className="w-4"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function MultiSelectBar<T>({
  selected,
  setSelected,
  elements,
}: {
  selected: T
  setSelected: StateUpdater<T>
  elements: { item: T; element: JSXInternal.Element }[]
}) {
  return (
    <>
      {elements.map(({ item, element }) => (
        <button
          className={`${
            item === selected
              ? "bg-neutral-300 dark:bg-neutral-600"
              : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          }  text-neutral-800 dark:text-neutral-200 py-2 px-4`}
          onClick={() => setSelected(item)}
        >
          {element}
        </button>
      ))}
    </>
  )
}

export enum ViewMode {
  LIST = "list",
  GRID = "grid",
}

export function ViewBar({ viewMode, setViewMode }) {
  return (
    <div className="flex flex-col justify-between">
      <label
        htmlFor="view-mode"
        className="text-sm font-medium text-gray-700 dark:text-gray-400"
      >
        View Mode
      </label>
      <div
        className="inline-flex shadow-sm rounded overflow-hidden"
        id="view-mode"
      >
        <MultiSelectBar
          selected={viewMode}
          setSelected={setViewMode}
          elements={[
            { item: ViewMode.GRID, element: <FontAwesomeIcon icon={faGrip} /> },
            { item: ViewMode.LIST, element: <FontAwesomeIcon icon={faBars} /> },
          ]}
        />
      </div>
    </div>
  )
}

export enum SortBy {
  NAME = "Name",
  KIND = "Kind",
  DATE_CREATED = "Date Created",
  DATE_MODIFIED = "Date Modified",
  SIZE = "Size",
}

export enum SortDirection {
  UP = "Up",
  DOWN = "Down",
}

type SortBarProps = {
  sortBy: SortBy
  setSortBy: StateUpdater<SortBy>
}

export function SortBar({ sortBy, setSortBy }: SortBarProps) {
  return (
    <>
      <div className="flex flex-col justify-between">
        <label
          htmlFor="view-mode"
          className="text-sm font-medium text-gray-700 dark:text-gray-400"
        >
          Sorting
        </label>
        <div
          className="inline-flex shadow-sm rounded overflow-hidden"
          id="view-mode"
        >
          <Dropdown />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <span />
        <div
          className="inline-flex shadow-sm rounded overflow-hidden"
          id="view-mode"
        >
          Test2
        </div>
      </div>
    </>
  )
}
