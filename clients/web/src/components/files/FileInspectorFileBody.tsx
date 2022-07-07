import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { FileModel } from "@crate/api-lib"

export function FileInspectorFileBody({ file }: { file: FileModel }) {
  const { name, cid } = { name: "", cid: "", ...file }
  const rows: [string, string, string?, boolean?][] = []
  if (name && name !== "") rows.push(["Name", name])
  rows.push(["Path", `/${name ? name : ""}`])
  if (name && name.includes("."))
    rows.push(["Extension", name.split(".", 2)[1]])
  rows.push(["CID", cid, "text-xs font-mono break-all", true])

  return (
    <div className="p-2 text-sm">
      <table>
        {rows.map(([title, value, classes, copy]) => (
          <tr>
            <td className="font-semibold text-gray-600 dark:text-gray-300 text-right pr-4 align-top w-20">
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
