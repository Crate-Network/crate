import { createContext } from "preact"

const FileContext = createContext({
  files: {},
})

function FileProvider({ children }) {}

export default FileContext
export { FileProvider }
