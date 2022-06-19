export enum FileType {
  FILE = "file",
  DIRECTORY = "directory",
}

type BaseFileModel = {
  // CID from the contents of the file
  readonly cid: string
  // name without extension
  name: string
  // full file name
  fullName: string
  // extension (if exists)
  extension?: string
  // type of file
  type: FileType
  // whether the contents of this file are encrypted
  encrypted: boolean
  // the encryption key for this file
  encKey: string
  // the size of the file
  readonly size: number
}

export type FileModel = (
  | {
      type: FileType.FILE
    }
  | {
      type: FileType.DIRECTORY
      links: string[]
      cumulativeSize: number
    }
) &
  BaseFileModel
