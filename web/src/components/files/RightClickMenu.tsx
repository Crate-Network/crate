import { FileModel } from "@crate/common"
import { FileAction } from "models/FileMutator"
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

type RightClickMenuProps = {
  file: FileModel
  onRenameRequest?: () => void
} & PopoverMenuProps

export default function RightClickMenu({
  file,
  close,
  anchor,
  onRenameRequest,
  ...props
}: RightClickMenuProps & JSXInternal.HTMLAttributes<HTMLDivElement>) {
  const { showInspector, dispatchSelection } = useContext(FilesPageContext)
  const deleteFile = useFileStore((state) => state.deleteFile)

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
  const copyUID = () => navigator.clipboard.writeText(file.id)

  const opts = [
    makeOpt("Open", close, openFile),
    makeOpt("Download", close, downloadFile),
    "divider",
    makeOpt("Delete", close, () => deleteFile(file)),
    "divider",
    makeOpt("Inspect", close, showInspector),
    makeOpt("Rename", close, onRenameRequest, !onRenameRequest),
    makeOpt("Copy CID", close, copyCID),
    makeOpt("Copy UID", close, copyUID),
    "divider",
    makeOpt("Share", close),
  ].filter((v) => v !== "none") as (SelectionOptions | "divider")[]

  return <PopoverMenu close={close} anchor={anchor} opts={opts} {...props} />
}
