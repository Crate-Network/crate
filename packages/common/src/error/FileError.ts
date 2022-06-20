import { FileModel } from "@crate/common"

export enum FileErrorType {
  EXISTS = "File with name already exists",
  FILE_INVALID = "Invalid usage, expected to be of type FileType.FOLDER",
  FOLDER_INVALID = "Invalid usage, expected to be of type FileType.FILE",
}

export class FileError extends Error {
  readonly file: FileModel
  constructor(m: FileErrorType, f: FileModel) {
    super(m)
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    this.name = FileError.name
    this.file = f
  }
}
