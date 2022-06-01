import { UnixFS } from "ipfs-unixfs"

export enum FileType {
  RAW,
  FILE,
  DIRECTORY,
}

export type FileModel = {
  // unique ID of this particular file
  id: string
  // CID from the contents of the file
  cid: string
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
  size: number
  // if folder, size of all children, otherwise cumulativeSize == size
  cumulativeSize: number
  // the unixFS node for the file (if downloaded)
  unixFS?: UnixFS
}

export type FileEventListeners = {
  onRenameRequest?: () => void
  onDelete?: () => void
}
