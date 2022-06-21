import { CID } from "multiformats/cid"
import Hash from "ipfs-only-hash"
import { FileModel, FileModelTypeEnum as FileType } from "@crate/api-lib"

export async function createFile(
  name: string,
  type: FileType
): Promise<FileModel> {
  const cid = CID.parse(await Hash.of("")).toString()
  const file = {
    cid,
    name,
    type,
    mode: 420,
    size: 0,
    date: new Date().toISOString(),
  }
  return type === "file"
    ? { ...file }
    : { ...file, links: [], cumulativeSize: 0 }
}

export function renameFile(file: FileModel, newName: string): FileModel {
  return {
    ...file,
    name: newName,
  }
}

export function duplicateFile(file: FileModel): FileModel {
  const [name, ...rest] = file.name.split(".")
  return {
    ...file,
    name: name + " copy." + rest.join("."),
    date: new Date().toISOString(),
  }
}
