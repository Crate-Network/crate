import { CID } from "multiformats/cid"
import Hash from "ipfs-only-hash"
import { FileModel, FileType } from "../model"

export async function createFile(
  fullName: string,
  type: FileType
): Promise<FileModel> {
  const cid = CID.parse(await Hash.of("")).toString()
  const [name, extension] = fullName.split(".")
  const file = {
    cid,
    name,
    fullName,
    type,
    size: 0,
    date: new Date(),
  }
  return type === FileType.FILE
    ? { ...file, extension }
    : { ...file, links: [], cumulativeSize: 0 }
}

export function renameFile(file: FileModel, newName: string): FileModel {
  const [name, extension] = newName.split(".")
  return file.type === FileType.FILE
    ? {
        ...file,
        fullName: newName,
        name,
        extension,
      }
    : {
        ...file,
        fullName: newName,
        name: newName,
        extension: undefined,
      }
}

export function duplicateFile(file: FileModel): FileModel {
  return {
    ...file,
    fullName: file.name + " copy" + file.extension ? "." + file.extension : "",
    name: file.name + " copy",
    date: new Date(),
  }
}
