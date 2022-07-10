import { FileModel } from "@crate/api-lib"

type NamedFileModel = FileModel & { name: string }
export default NamedFileModel
