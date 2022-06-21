import { CID } from "multiformats/cid"

export type FileType = "file" | "directory"
export type FileModel = {
  // CID from the contents of the file
  cid: string
  // full file name
  name: string
  // type of file
  type: FileType
  // the size of the file/folder
  size: number
  // date created
  date: Date
  // permissions
  mode: number
  // the encryption key for this file, signed by the user's data key
  signedEncryptionKey?: string
  // -- only relevant for "directory", we ignore IPFS file chunking --
  // CIDs of children
  links?: { cid: string; name: string; size: number }[]
  // size of all contained files/folders
  cumulativeSize?: number
}
