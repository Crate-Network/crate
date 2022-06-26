export default {
  apiPath: "/api/v1",
  upload(files: FileList) {
    if (!files || files.length === 0) {
      return
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      formData.append("files", file, file.name)
    }

    fetch(`${this.apiPath}/file`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer xxxx",
      },
    })
  },
}
