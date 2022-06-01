export type FileModel = {
  id: string
  cid: string
  name: string
}

export type FileEventListeners = {
  onRenameRequest?: () => void
  onDelete?: () => void
}
