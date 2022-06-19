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
import { Popover, PopoverButtonRow } from "components/Popover"

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
  const { inspect, selection } = useContext(FilesPageContext)

  const deleteFile = useFileStore((state) => state.deleteFile)
  const deleteFiles = () => {
    selection.forEach((fileKey) => {
      deleteFile(files[fileKey])
    })
  }

  const file = files[selection[0]]

  const openFile = () =>
    window.open(
      `https://crate.network/ipfs/${file.cid}?filename=${file.fullName}`,
      "_blank"
    )
  const downloadFile = () =>
    window.open(
      `https://crate.network/ipfs/${file.cid}?filename=${file.fullName}&download=true`,
      "_blank"
    )
  const copyCID = () => navigator.clipboard.writeText(file.cid)

  const opts = [
    makeOpt("Open", close, openFile),
    makeOpt("Download", close, downloadFile),
    "divider",
    makeOpt("Delete", close, deleteFiles),
    "divider",
    makeOpt("Inspect", close, inspect),
    makeOpt("Rename", close, onRenameRequest, !onRenameRequest),
    makeOpt("Copy CID", close, copyCID),
    "divider",
    makeOpt("Share", close),
  ].filter((v) => v !== "none") as (SelectionOptions | "divider")[]

  return <PopoverMenu close={close} anchor={anchor} opts={opts} {...props} />
}
