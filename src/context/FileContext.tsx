import { FileModel } from "models/FileModel"
import { v4 as uuidv4 } from "uuid"
import { createContext } from "preact"

type FileContextType = {
  files: FileModel[]
}

const FileContext = createContext<FileContextType>({
  files: [],
})

function FileProvider({ children }) {
  const files = Array.from({ length: 50 }, () => ({
    id: uuidv4(),
  })) as FileModel[]

  return (
    <FileContext.Provider value={{ files }}>{children}</FileContext.Provider>
  )
}

export default FileContext
export { FileProvider }
