import { FileModel } from "./FileModel"

export enum FileAction {
  DELETE,
  RENAME,
}

export type FileMutator = { file: FileModel } & (
  | {
      action: FileAction.DELETE
    }
  | {
      action: FileAction.RENAME
      name: string
    }
)
