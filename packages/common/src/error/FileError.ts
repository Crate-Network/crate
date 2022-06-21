import { FileModel } from "../model"

export enum FileErrorType {
  INVALID = "Invalid function usage.",
  EXISTS = "File with name already exists",
  FILE_INVALID = "Invalid usage, expected to be of type FileType.FOLDER",
  FOLDER_INVALID = "Invalid usage, expected to be of type FileType.FILE",
  NO_DATA = "Data field expected but not found on data block.",
}

export class FileError extends Error {
  readonly file: FileModel
  constructor(m: FileErrorType) {
    super(m)
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    this.name = FileError.name
  }
}
