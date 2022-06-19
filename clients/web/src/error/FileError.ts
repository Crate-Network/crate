import { FileModel } from "@crate/common"

export enum FileErrorType {
  EXISTS = "File with name already exists",
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
