import Hash from "ipfs-only-hash"
import { CID } from "multiformats/cid"

export enum FileType {
  FILE = "file",
  DIRECTORY = "directory",
}

export type FileModel = {
  // CID from the contents of the file
  cid: CID
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
  // -- only relevant for FileType.DIRECTORY --
  // CIDs of children
  links?: string[]
  // size of all contained files/folders
  cumulativeSize?: number
}

export async function makeFile(fullName: string, type: FileType) {
  const cid = CID.parse(await Hash.of(""))
  const [name, extension] = fullName.split(".")
  const file = {
    cid,
    name,
    fullName,
    type,
    size: 0,
    date: new Date(),
  }
  return (
    type === FileType.FILE
      ? { ...file, extension }
      : { ...file, links: [], cumulativeSize: 0 }
  ) as FileModel
}

export function duplicateFile(file: FileModel) {
  return {
    ...file,
    fullName: file.name + " copy" + file.extension ? "." + file.extension : "",
    name: file.name + " copy",
    date: new Date(),
  }
}
