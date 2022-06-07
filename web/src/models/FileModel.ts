export enum FileType {
  RAW,
  FILE,
  DIRECTORY,
}

export type FileModel = {
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

export type FileEventListeners = {
  onRenameRequest?: () => void
  onDelete?: () => void
}
