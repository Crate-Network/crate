import { CID, Node } from "./ipfs"
import { Buffer } from "buffer"
import { FileModel, FileType } from "@crate/types"

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
  const [name, ...rest] = file.name ? file.name.split(".") : [file.cid]
  return {
    ...file,
    name: name + " copy." + rest.join("."),
    date: new Date().toISOString(),
  }
}

// splits a path into segments
export function splitPath(path: string) {
  return path
    .split("/")
    .filter((e) => e !== "" && e !== null)
    .slice(1)
}

// verify path format
export function validPath(path: string) {
  if (!path.startsWith("/")) return false
  const segments = splitPath(path)
  if (segments.length < 1) return false
  try {
    CID.parse(segments[0])
  } catch (_e) {
    return false
  }
  return true
}
