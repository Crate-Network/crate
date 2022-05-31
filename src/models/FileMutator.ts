import { FileModel } from "./FileModel"

export enum FileAction {
  DELETE,
  RENAME,
}

type BaseFileMutator = {
  file: FileModel
  action: FileAction
}

export interface FileMutateDelete extends BaseFileMutator {
  action: FileAction.DELETE
}

export interface FileMutateRename extends BaseFileMutator {
  action: FileAction.RENAME
  name: string
}

export type FileMutator = FileMutateDelete | FileMutateRename
