import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { FileModel } from "@crate/common"

export function FileInspectorFileBody({ file }: { file: FileModel }) {
  const rows = [
    ["Name", file.name],
    file.name.includes(".") ? ["Extension", file.name.split(".", 2)[1]] : null,
    ["CID", file.cid, "text-xs font-mono break-all", true],
  ].filter((el) => el !== null) as [string, string, string?, boolean?][]

  return (
    <div className="p-2 text-sm">
      <table>
        {rows.map(([title, value, classes, copy]) => (
          <tr>
            <td className="font-semibold text-gray-600 dark:text-gray-300 text-right pr-4 align-top">
              {title}
            </td>
            <td className={typeof classes === "string" ? classes : ""}>
              {value}{" "}
              {copy && (
                <span
                  className="rounded-sm p-0.5 hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-600 dark:active:bg-neutral-700 transition-all dark:text-white cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(value)
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </span>
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}
