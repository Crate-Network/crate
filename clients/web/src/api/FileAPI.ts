import { FileModel } from "@crate/api-lib"
import { useUserStore } from "store/UserStore"

export default {
  apiPath: "/api/v1",
  authHeader: async () => ({
    Authorization: `Bearer ${await useUserStore.getState().user.getIdToken()}`,
  }),

  async upload(files: FileList, path = "/") {
    if (!files || files.length === 0) {
      return
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      formData.append("files", file, file.name)
    }

    return await fetch(
      `${this.apiPath}/file?path=${encodeURIComponent(path)}`,
      {
        method: "POST",
        body: formData,
        headers: await this.authHeader(),
      }
    )
  },

  async get(path = "/"): Promise<FileModel> {
    return (
      await fetch(`${this.apiPath}/file?path=${encodeURIComponent(path)}`, {
        method: "GET",
        headers: await this.authHeader(),
      })
    ).json()
  },

  async getCID(cid: string): Promise<FileModel> {
    return (
      await fetch(`${this.apiPath}/file?cid=${cid}`, {
        method: "GET",
        headers: await this.authHeader(),
      })
    ).json()
  },
}
