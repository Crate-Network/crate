import { FilesPageContext } from "pages/Files"
import { useContext } from "preact/hooks"
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
  const files = useFileStore((state) => state.files)
  const addFile = useFileStore((state) => state.addFile)
  const deleteFile = useFileStore((state) => state.deleteFile)

  const { inspect, selection } = useContext(FilesPageContext)
  const file = files[selection[0]]
  const deleteFiles = () => {
    selection.forEach((fileKey) => {
      deleteFile(files[fileKey])
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
    makeOpt("Duplicate", close, () => addFile(duplicateFile(file))),
    "divider",
    makeOpt("Inspect", close, inspect),
    makeOpt("Copy CID", close, copyCID),
    makeOpt("Share", close),
  ].filter((v) => v !== "none") as (SelectionOptions | "divider")[]

  return <PopoverMenu close={close} anchor={anchor} opts={opts} {...props} />
}
