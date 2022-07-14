import express from "express"
import { auth } from "./firebase"
import files from "./routes/files-route"
import fileUpload from "express-fileupload"
import pinning from "./routes/pinning-route"
import logger from "./logger"
import morgan from "morgan"

// const args = process.argv.slice(2);
const app = express()

const API_VERSION = "v1"
const API_ROUTE = `/api/${API_VERSION}`

app.use(morgan("tiny"))
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.sendStatus(403)
    return
  }

  const [type, token] = authHeader.split(" ")

  if (!token || type !== "Bearer") {
    res.status(403).send("Invalid request.")
    return
  }

  // if (process.env.NODE_ENV === "production") {
  auth
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.token = decodedToken
      next()
    })
    .catch((err) => {
      res.status(403).send("Token unauthorized.")
      logger.error(err)
    })
  // } else {
  //   req.token = { uid: "devAccount" } as DecodedIdToken;
  //   next();
  // }
})

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

app.use(`${API_ROUTE}/file`, files)
app.use(`${API_ROUTE}/pins`, pinning)

const port = process.env["PORT"] || 3030
app.listen(port, () => {
  logger.info(`Listening on port ${port}`)
})
