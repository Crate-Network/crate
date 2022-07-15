import { JSXInternal } from "preact/src/jsx"
import {
  makeOpt,
  PopoverMenu,
  PopoverMenuProps,
  SelectionOptions,
} from "./PopoverMenu"
import { useFileStore } from "../../store/FileStore"
import Anchor from "../../models/Anchor"
import { duplicateFile } from "@crate/common"
import shallow from "zustand/shallow"
import { useStore as useFVStore } from "../../store/FileViewStore"
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
    (state) => [state.files, state.add, state.delete, state.get],
    shallow
  )
  const [selection, path] = useFVStore(
    (state) => [state.selectedFiles, state.path],
    shallow
  )

  const [file, setFile] = useState(null)
  useEffect(() => {
    const fileMapping = {}
    files[path].links.forEach((f) => (fileMapping[f.name] = f))
    const fetchFile = async () => setFile(await retrieve(selection[0].name))
    fetchFile()
  }, [path, files, retrieve, selection])

  const deleteFiles = () => {
    selection.forEach(({ cid }) => {
      deleteFile(cid)
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
    makeOpt("Duplicate", close, () => addFile(path, duplicateFile(file))),
    "divider",
    makeOpt("Inspect", close, useFVStore().showInspector),
    makeOpt("Copy CID", close, copyCID),
    makeOpt("Share", close),
  ].filter((v) => v !== "none") as (SelectionOptions | "divider")[]

  if (file === null) return null
  return <PopoverMenu close={close} anchor={anchor} opts={opts} {...props} />
}
