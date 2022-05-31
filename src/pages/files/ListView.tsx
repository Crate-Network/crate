import { FileViewProps } from "../Files"

export function ListView({ files }: FileViewProps) {
  return (
    <table class="min-w-full text-left">
      <thead class="border-b">
        <tr>
          <th scope="col">File Name</th>
          <th scope="col">Date</th>
          <th scope="col">Size</th>
          <th scope="col">CID</th>
        </tr>
      </thead>
    </table>
  )
}
