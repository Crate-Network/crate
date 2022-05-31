export type FileModel = {
  id: string
  cid: string
  name: string
}

export type FileEventListeners = {
  onRenameRequest?: (finish: (newName: string) => void) => void
  onDelete?: () => void
}
