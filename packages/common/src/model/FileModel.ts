import { CID } from "multiformats/cid"

export enum FileType {
  FILE = "file",
  DIRECTORY = "directory",
}

export type FileModel = {
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
  // the encryption key for this file, signed by the user's data key
  signedEncryptionKey?: string
  // the size of the file/folder
  size: number
  // date created
  date: Date
  // -- only relevant for FileType.DIRECTORY, we ignore IPFS file chunking --
  // CIDs of children
  links?: { cid: string; name: string; size: number }[]
  // size of all contained files/folders
  cumulativeSize?: number
}
