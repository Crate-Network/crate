import { FileModel } from "models/FileModel"
import { v4 as uuidv4 } from "uuid"
import { createContext } from "preact"
import { useReducer } from "preact/hooks"

type FileAction = "delete" | "rename"
interface FileMutator {
  file: FileModel
  action: FileAction
}
export interface FileMutateDelete extends FileMutator {
  action: "delete"
}
export interface FileMutateRename extends FileMutator {
  action: "rename"
  name: string
}

type FileContextType = {
  files: FileModel[]
  dispatchFile: <T extends FileMutator>(mutator: T) => void
}

const FileContext = createContext<FileContextType>({
  files: [],
  dispatchFile: () => null,
})

const defaultFiles = Array.from({ length: 50 }, () => ({
  id: uuidv4(),
})) as FileModel[]

const fileReducer = <T extends FileMutator>(
  prevState: FileModel[],
  mutation: T
): FileModel[] => {
  const { file, action } = mutation
  switch (action) {
    case "delete":
      return prevState
    case "rename":
      return prevState
    default:
      return prevState
  }
}

function FileProvider({ children }) {
  const [files, dispatch] = useReducer<FileModel[], FileMutator>(fileReducer, [
    ...defaultFiles,
  ])
  return (
    <FileContext.Provider value={{ files, dispatchFile: dispatch }}>
      {children}
    </FileContext.Provider>
  )
}

export default FileContext
export { FileProvider }
