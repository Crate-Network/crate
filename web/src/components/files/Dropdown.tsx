import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useClickOutside from "hooks/useClickOutside"
import Anchor from "models/Anchor"
import { useRef, useState } from "preact/hooks"
import { PopoverMenu } from "./PopoverMenu"

export default function Dropdown() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [anchorPos, setAnchorPos] = useState<null | Anchor>(null)
  const expanded = Boolean(anchorPos)
  const toggleExpanded = (e: MouseEvent) => {
    e.preventDefault()
    if (expanded) setAnchorPos(null)
    else setAnchorPos({ top: e.pageY, left: e.pageX })
  }
  useClickOutside(btnRef, () => setAnchorPos(null))

  return (
    <>
      <button
        ref={btnRef}
        className={`
        flex 
        justify-between 
        items-center
        space-x-4
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white 
        dark:bg-gray-600 
        dark:text-neutral-50
        bg-clip-padding
        border border-solid border-gray-300
        dark:border-neutral-700
        rounded
        transition
        ease-in-out
        m-0
        ${
          expanded
            ? "dark:text-neutral-50 dark:bg-gray-700 text-gray-700 bg-white border-blue-600 outline-none"
            : ""
        }`}
        onClick={toggleExpanded}
      >
        <span>Currently Selected</span>
        <FontAwesomeIcon icon={faCaretDown} />
      </button>
      {expanded && (
        <PopoverMenu
          anchor={anchorPos}
          close={toggleExpanded}
          opts={[{ name: "Test", func: () => {} }]}
        />
      )}
    </>
  )
}
