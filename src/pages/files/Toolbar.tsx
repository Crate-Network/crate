import { faUpload, faGrip, faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "components/Button"
import FormInput from "components/FormInput"
import { useRef } from "preact/hooks"

export function UploadButton() {
  const input = useRef(null)
  const onUpload = (e) => {
    console.log(e)
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
    <div className="flex flex-col justify-between w-full max-w-2xl mr-8">
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

export enum ViewMode {
  LIST,
  GRID,
}

export function ViewBar({ viewMode, setViewMode }) {
  return (
    <div className="flex flex-col justify-between mr-8">
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
        <button
          className={`${
            viewMode === ViewMode.GRID
              ? "bg-slate-300 dark:bg-slate-600"
              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          }  text-slate-800 dark:text-slate-200 py-2 px-4`}
          onClick={() => setViewMode(ViewMode.GRID)}
        >
          <FontAwesomeIcon icon={faGrip} />
        </button>
        <button
          className={`${
            viewMode === ViewMode.LIST
              ? "bg-slate-300 dark:bg-slate-600"
              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          }  text-slate-800 dark:text-slate-200 py-2 px-4`}
          onClick={() => setViewMode(ViewMode.LIST)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </div>
  )
}
