import { FileModel } from "@crate/api-lib"
import { FileError, FileErrorType } from "@crate/common"
import { useErrorStore } from "store/ErrorStore"
import { useUserStore } from "store/UserStore"

export default {
  apiPath: "/api/v1",
  async authHeader() {
    const idToken = !useUserStore.getState().user.getIdToken
      ? await new Promise((resolve) => {
          useUserStore.subscribe(
            (state) => state.user,
            (user) => {
              if (user.getIdToken) resolve(user.getIdToken())
            }
          )
        })
      : await useUserStore.getState().user.getIdToken()

    return {
      Authorization: `Bearer ${idToken}`,
    }
  },

  async fetch(url, params = {}) {
    const res = await fetch(url, {
      method: "GET",
      headers: await this.authHeader(),
      ...params,
    })
    if (res.status !== 200) {
      const fErr = new FileError(FileErrorType.CONNECTION_FAILURE)
      useErrorStore.getState().showError(fErr)
    }
    return res
  },

  async update(fileModel: FileModel, path: string) {
    return await this.fetch(
      `${this.apiPath}/file?path=${encodeURIComponent(path)}`,
      {
        method: "POST",
        body: JSON.stringify(fileModel),
      }
    )
  },

  // async pin(cid: CID) {

  // },

  async upload(files: FileList, path: string) {
    if (!files || files.length === 0) {
      return
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      formData.append("files", file, file.name)
    }

    return await this.fetch(
      `${this.apiPath}/file?path=${encodeURIComponent(path)}`,
      {
        method: "PUT",
        body: formData,
      }
    )
  },

  async get(path: string): Promise<FileModel> {
    const url = `${this.apiPath}/file?path=${encodeURIComponent(path)}`
    const res = await this.fetch(url)
    return res.json()
  },

  async getCID(cid: string): Promise<FileModel> {
    const url = `${this.apiPath}/file?cid=${cid}`
    const res = await this.fetch(url)
    return res.json()
  },
}
