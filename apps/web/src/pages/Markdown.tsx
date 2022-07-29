import hljs from "highlight.js"
import "highlight.js/styles/atom-one-dark.css"
import { useEffect } from "preact/hooks"

export default function Markdown({ html }) {
  useEffect(() => {
    hljs.highlightAll()
  }, [])

  return (
    <main
      className="text-contents max-w-screen-2xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
