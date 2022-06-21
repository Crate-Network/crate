import { FileModel, renameFile, FileError, FileErrorType } from "@crate/common"
import produce from "immer"
import { WritableDraft } from "immer/dist/internal"
import create, { StateCreator } from "zustand"
import equal from "deep-equal"
import { useErrorStore } from "./ErrorStore"

interface FileState {
  files: Record<string, FileModel>
  syncing: boolean
  deleteFile: (file: FileModel) => void
  addFile: (file: FileModel) => void
  renameFile: (file: FileModel, newName: string) => void
}

const fileStateCreator: StateCreator<FileState> = (set): FileState => {
  const mutate = (f: (draft: WritableDraft<FileState>) => void) => {
    try {
      set(produce(f))
    } catch (e) {
      useErrorStore.getState().showMessage((e as FileError).message)
    }
  }

  return {
    files: {},
    syncing: false,
    deleteFile: (file: FileModel) =>
      mutate(({ files }) => {
        delete files[file.name]
      }),
    addFile: (file: FileModel) =>
      mutate(({ files }) => {
        if (file.name in files) throw new FileError(FileErrorType.EXISTS)
        files[file.name] = file
      }),
    renameFile: (file: FileModel, newName: string) =>
      mutate(({ files }) => {
        if (newName in files) throw new FileError(FileErrorType.EXISTS)
        files[newName] = renameFile(file, newName)
        delete files[file.name]
      }),
  }
}

type Operation = "create" | "update" | "delete"
const getOp = (difference: number): Operation => {
  if (difference < 0) return "delete"
  else if (difference === 0) return "update"
  return "create"
}

// synchronize local state with server on change
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
