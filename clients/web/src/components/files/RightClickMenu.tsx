import { JSXInternal } from "preact/src/jsx"
import {
  makeOpt,
  PopoverMenu,
  PopoverMenuProps,
  SelectionOptions,
} from "./PopoverMenu"
import { useFileStore } from "store/FileStore"
import Anchor from "models/Anchor"
import { duplicateFile } from "@crate/common"
import shallow from "zustand/shallow"
import { useStore as useFVStore } from "store/FileViewStore"
import { useEffect, useState } from "preact/hooks"

type RightClickMenuProps = {
  close?: (e: MouseEvent) => void
  anchor?: Anchor
  onRenameRequest?: () => void
} & PopoverMenuProps

export default function RightClickMenu({
  close,
  anchor,
  onRenameRequest,
  ...props
}: RightClickMenuProps & JSXInternal.HTMLAttributes<HTMLDivElement>) {
  const [files, addFile, deleteFile, retrieve] = useFileStore(
    (state) => [state.files, state.add, state.delete, state.retrieve],
    shallow
  )
  const [selection, directory] = useFVStore(
    (state) => [state.selectedFiles, state.visible],
    shallow
  )

  const [file, setFile] = useState(null)
  useEffect(() => {
    const fetchFile = async () => setFile(await retrieve(selection[0]))
    fetchFile()
  }, [retrieve, selection])

  const deleteFiles = () => {
    selection.forEach((fileKey) => {
      deleteFile(files[fileKey].cid)
    })
  }

  const openFile = () =>
    window.open(
      `https://crate.network/ipfs/${file.cid}?filename=${file.name}`,
      "_blank"
    )
  const downloadFile = () =>
    window.open(
      `https://crate.network/ipfs/${file.cid}?filename=${file.name}&download=true`,
      "_blank"
    )
  const copyCID = () => navigator.clipboard.writeText(file.cid)

  const opts = [
    makeOpt("Open", close, openFile),
    makeOpt("Download", close, downloadFile),
    "divider",
    makeOpt("Delete", close, deleteFiles),
    "divider",
    makeOpt("Rename", close, onRenameRequest, !onRenameRequest),
    makeOpt("Duplicate", close, () => addFile(directory, duplicateFile(file))),
    "divider",
    makeOpt("Inspect", close, useFVStore().showInspector),
    makeOpt("Copy CID", close, copyCID),
    makeOpt("Share", close),
  ].filter((v) => v !== "none") as (SelectionOptions | "divider")[]

  if (file === null) return null
  return <PopoverMenu close={close} anchor={anchor} opts={opts} {...props} />
}
