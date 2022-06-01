import { FileModel, FileType } from "models/FileModel"
import { v4 as uuidv4 } from "uuid"
import { createContext } from "preact"
import { Reducer, useEffect, useReducer } from "preact/hooks"
import { FileAction, FileMutator } from "models/FileMutator"
import { UnixFS } from "ipfs-unixfs"

type FileContextType = {
  files: FileModel[]
  dispatchFileAction: (mutator: FileMutator) => void
}

const FileContext = createContext<FileContextType>({
  files: [],
  dispatchFileAction: () => null,
})

const defaultFiles: FileModel[] = Array.from({ length: 50 }, () => ({
  id: uuidv4(),
  fullName: "file.txt",
  name: "file",
  extension: "txt",
  encrypted: true,
  encKey: "something",
  type: FileType.FILE,
  cid: "QmQ5vhrL7uv6tuoN9KeVBwd4PwfQkXdVVmDLUZuTNxqgvm",
  date: new Date(),
  size: 0,
  unixFS: new UnixFS({
    type: "file",
    data: new Uint8Array([2, 3, 4, 5]),
    blockSizes: [32],
    mtime: new Date(),
  }),
}))

console.log(defaultFiles[0].unixFS)

const fileReducer: Reducer<FileModel[], FileMutator> = (
  prevState: FileModel[],
  mutation: FileMutator
): FileModel[] => {
  const { file, action } = mutation

  const updateFile = (update: (oldFile: FileModel) => FileModel) =>
    prevState.map((el) => (el.id === file.id ? update(el) : el))

  switch (action) {
    case FileAction.DELETE:
      return prevState.filter((el) => el.id !== file.id)
    case FileAction.RENAME:
      const { name: fullName } = mutation
      const name = fullName.slice(0, fullName.indexOf("."))
      const extension = fullName.slice(fullName.indexOf(".") + 1)
      return updateFile((el) => ({ ...el, fullName, name, extension }))
    default:
      return prevState
  }
}

function FileProvider({ children }) {
  const [files, dispatch] = useReducer(fileReducer, [...defaultFiles])

  useEffect(() => {
    // TODO: synchronize file changes with server
  }, [files])

  return (
    <FileContext.Provider value={{ files, dispatchFileAction: dispatch }}>
      {children}
    </FileContext.Provider>
  )
}

export default FileContext
export { FileProvider }
