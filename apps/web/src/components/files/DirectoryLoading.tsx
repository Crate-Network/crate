export default function DirectoryLoading() {
  return (
    <div className="w-full text-center italic">
      <div
        style="border-top-color:transparent"
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-orange-500"
        role="status"
      >
        <span class="hidden">Loading...</span>
      </div>
    </div>
  )
}
