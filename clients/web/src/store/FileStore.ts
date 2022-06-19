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

export const useFileStore = create<FileState>()(fileStateCreator)
useFileStore.subscribe(({ files }, prev) => {
  const diff = Object.values(files).filter(
    (f) => !(f.fullName in prev.files && equal(f, prev.files[f.fullName]))
  )
  if (diff.length === 0) return

  console.log(diff)
})
