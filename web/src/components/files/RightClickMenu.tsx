import FileContext from "context/FileContext"
import { FileModel } from "models/FileModel"
import { FileAction } from "models/FileMutator"
import { FilesPageContext } from "pages/Files"
import { useContext } from "preact/hooks"
import { JSXInternal } from "preact/src/jsx"
import { PopoverMenu, PopoverMenuProps, SelectionOptions } from "./PopoverMenu"

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
  const { dispatchFileAction } = useContext(FileContext)

  const mOpt = (name: string, f?: () => void, hide: boolean = false) =>
    hide
      ? "none"
      : {
          name,
          func: (e: MouseEvent) => {
            if (f) f()
            close(e)
          },
        }

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
  const deleteFile = () =>
    dispatchFileAction({ action: FileAction.DELETE, file })

  const opts = [
    mOpt("Open", openFile),
    mOpt("Download", downloadFile),
    "divider",
    mOpt("Delete", deleteFile),
    "divider",
    mOpt("Inspect", showInspector),
    mOpt("Rename", onRenameRequest, !onRenameRequest),
    mOpt("Copy CID", copyCID),
    mOpt("Copy UID", copyUID),
    "divider",
    mOpt("Share"),
  ].filter((v) => v !== "none") as (SelectionOptions | "divider")[]

  return <PopoverMenu close={close} anchor={anchor} opts={opts} {...props} />
}
