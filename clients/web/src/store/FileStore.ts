import { FileModel, FileType } from "@crate/common"
import produce from "immer"
import { WritableDraft } from "immer/dist/internal"
import { v4 as uuidv4 } from "uuid"
import create, { StateCreator } from "zustand"
import equal from "deep-equal"
import { FileError, FileErrorType } from "error/FileError"

const defaultFiles: Record<string, FileModel> = {}
Array.from(
  { length: 10 },
  (_, idx): FileModel => ({
    fullName: `file${idx}.txt`,
    name: `file${idx}`,
    extension: "txt",
    signedEncryptionKey: "something",
    type: FileType.FILE,
    cid: "QmQ5vhrL7uv6tuoN9KeVBwd4PwfQkXdVVmDLUZuTNxqgvm",
    date: new Date(),
    size: 0,
    links: [],
    cumulativeSize: 0,
  })
).forEach((file) => (defaultFiles[file.fullName] = file))

interface FileState {
  files: Record<string, FileModel>
  deleteFile: (file: FileModel) => void
  addFile: (file: FileModel) => void
  renameFile: (file: FileModel, newName: string) => void
}

const fileStateCreator: StateCreator<FileState> = (set): FileState => {
  const mutate = (f: (draft: WritableDraft<FileState>) => void) =>
    set(produce(f))

  return {
    files: { ...defaultFiles },
    deleteFile: (file: FileModel) =>
      mutate(({ files }) => {
        delete files[file.fullName]
      }),
    addFile: (file: FileModel) =>
      mutate(({ files }) => {
        files[file.fullName] = file
      }),
    renameFile: (file: FileModel, newName: string) =>
      mutate(({ files }) => {
        if (newName in files) throw new FileError(FileErrorType.EXISTS, file)
        const [name, extension] = newName.split(".")
        files[newName] = {
          ...files[file.fullName],
          fullName: newName,
          name,
          extension,
        }
        delete files[file.fullName]
      }),
  }
}

type Operation = "create" | "update" | "delete"
const getOp = (difference: number): Operation => {
  if (difference < 0) return "delete"
  else if (difference === 0) return "update"
  return "create"
}

export const useFileStore = create<FileState>()(fileStateCreator)
useFileStore.subscribe(({ files }, prev) => {
  const op = getOp(
    Object.values(files).length - Object.values(prev.files).length
  )
  // get files that were added or modified
  const diff =
    op === "delete"
      ? Object.values(prev.files).filter(
          (f) => !(f.fullName in files && equal(f, files[f.fullName]))
        )
      : Object.values(files).filter(
          (f) => !(f.fullName in prev.files && equal(f, prev.files[f.fullName]))
        )

  if (diff.length === 0) return

  console.log(op, diff)
})
