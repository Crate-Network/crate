import { CID, Node } from "./ipfs"
import { Buffer } from "buffer"
import { FileModel, FileModelTypeEnum as FileType } from "@crate/api-lib"

export async function createFile(
  type: FileType,
  name = ""
): Promise<FileModel> {
  const content = type === "file" ? Buffer.from("") : undefined
  const node = Node.fromFile({ type }, content)
  const file = await Node.toFile(node)
  file.name = name
  return file
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

export const parsePath = (path: string) =>
  path.split("/").filter((s) => s.length > 0)
