import { FileModel } from "models/FileModel"
import { v4 as uuidv4 } from "uuid"
import { createContext } from "preact"
import { Reducer, useEffect, useReducer } from "preact/hooks"
import { FileAction, FileMutator } from "models/FileMutator"

type FileContextType = {
  files: FileModel[]
  dispatchFileAction: (mutator: FileMutator) => void
}

const FileContext = createContext<FileContextType>({
  files: [],
  dispatchFileAction: () => null,
})

const defaultFiles = Array.from({ length: 50 }, () => ({
  id: uuidv4(),
  name: "file.txt",
  cid: "QmQ5vhrL7uv6tuoN9KeVBwd4PwfQkXdVVmDLUZuTNxqgvm",
})) as FileModel[]

const fileReducer: Reducer<FileModel[], FileMutator> = (
  prevState: FileModel[],
  mutation: FileMutator
): FileModel[] => {
  const { file, action } = mutation
  switch (action) {
    case FileAction.DELETE:
      return prevState.filter((el) => el.id !== file.id)
    case FileAction.RENAME:
      return prevState.map((el) =>
        el.id === file.id ? { ...el, name: mutation.name } : el
      )
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
