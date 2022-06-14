import { FileModel, FileType } from "@crate/common"
import produce from "immer"
import { WritableDraft } from "immer/dist/internal"
import { v4 as uuidv4 } from "uuid"
import create, { StateCreator } from "zustand"
import equal from "deep-equal"

const defaultFiles: Record<string, FileModel> = {}
Array.from({ length: 10 }, () => ({
  id: uuidv4(),
  fullName: "file.txt",
  name: "file",
  extension: "txt",
  encrypted: true,
  encKey: "something",
  type: FileType.FILE,
  cid: "QmQ5vhrL7uv6tuoN9KeVBwd4PwfQkXdVVmDLUZuTNxqgvm",
  date: new Date(),
  size: 0,
  cumulativeSize: 0,
})).forEach((file) => {
  defaultFiles[file.id] = file
})

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
        delete files[file.id]
      }),
    addFile: (file: FileModel) =>
      mutate(({ files }) => {
        files[file.id] = file
      }),
    renameFile: (file: FileModel, newName: string) =>
      mutate(({ files }) => {
        const [name, extension] = newName.split(".")
        files[file.id] = {
          ...files[file.id],
          fullName: newName,
          name,
          extension,
        }
      }),
  }
}

export const useFileStore = create<FileState>()(fileStateCreator)

useFileStore.subscribe(({ files }, prev) => {
  const diff = Object.values(files).filter(
    (f) => !(f.id in prev.files && equal(f, prev.files[f.id]))
  )
  if (diff.length === 0) return

  console.log(diff)
})
