export default function FormBox(props) {
  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`flex-col m-12 w-96 p-12 self-center rounded-2xl shadow-lg border-opacity-10 border-2 border-neutral-900 bg-stone-200 dark:bg-stone-700 text-neutral-800 dark:text-neutral-100 ${props.className}`}
      >
        {props.children}
      </div>
    </div>
  )
}
