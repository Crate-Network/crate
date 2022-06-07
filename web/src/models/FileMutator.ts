import { FileModel } from "./FileModel"

export enum FileAction {
  CREATE,
  DELETE,
  RENAME,
}

export type FileMutator = { file: FileModel } & (
  | {
      action: FileAction.CREATE
      name: string
    }
  | {
      action: FileAction.DELETE
    }
  | {
      action: FileAction.RENAME
      name: string
    }
)
