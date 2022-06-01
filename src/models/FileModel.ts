export enum FileType {
  RAW,
  FILE,
  DIRECTORY,
}

export type FileModel = {
  id: string
  cid: string
  name: string
  fullName: string
  extension: string
  type: FileType
}

export type FileEventListeners = {
  onRenameRequest?: () => void
  onDelete?: () => void
}
