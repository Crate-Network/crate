export default function Button(props) {
  const { className, children, ...rest } = props
  return (
    <button
      className={`
        bg-orange-500 
        bg-clip-padding
        px-3
        py-1.5
        text-base
        font-normal
        rounded
        transition
        ease-in-out
        focus:text-gray-700 
        focus:bg-white 
        focus:border-blue-600 
        focus:outline-none 
        disabled:bg-gray-300
        dark:disabled:bg-gray-800
        disabled:text-neutral-400
        dark:disabled:text-neutral-600
        hover:shadow-md
        disabled:hover:shadow-none
        ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
