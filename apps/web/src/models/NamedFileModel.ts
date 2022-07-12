import { FileModel } from "@crate/types"

type NamedFileModel = FileModel & { name: string }
export default NamedFileModel
