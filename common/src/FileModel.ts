export enum FileType {
  RAW = 0,
  FILE = 1,
  DIRECTORY = 2,
}

type BaseFileModel = {
  // unique ID of this particular file
  readonly id: string
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
  // if folder, size of all children, otherwise cumulativeSize == size
  readonly cumulativeSize: number
}

export type FileModel = (
  | {
      type: FileType.FILE
      contents?: Uint8Array
    }
  | {
      type: FileType.DIRECTORY
      children: FileModel[]
    }
  | {
      type: FileType.RAW
      contents?: Uint8Array
    }
) &
  BaseFileModel
