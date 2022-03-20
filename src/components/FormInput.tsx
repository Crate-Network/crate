export default function FormInput(props) {
  return (
    <input
      class="
        form-control
        block
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
        dark:focus:text-neutral-50 
        dark:focus:bg-gray-700
        focus:text-gray-700 focus:bg-white 
        focus:border-blue-600 focus:outline-none
      "
      {...props}
    />
  )
}
