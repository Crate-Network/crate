import express from "express";
import { auth } from "./firebase";
import ipfs from "./routes/ipfs-route";
import pinning from "./routes/pinning-route";
import logger from "./logger";
import { DecodedIdToken } from "firebase-admin/auth";

const args = process.argv.slice(2);
const app = express();

app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.sendStatus(403);
    return;
  }

  const [type, token] = authHeader.split(" ");

  if (!token || type !== "Bearer") {
    res.status(403).send("Invalid request.");
    return;
  }

  if (process.env.NODE_ENV === "production") {
    auth
      .verifyIdToken(token)
      .then((decodedToken) => {
        req.token = decodedToken;
        next();
      })
      .catch((err) => {
        res.status(403).send("Token unauthorized.");
        logger.error(err);
      });
  } else {
    req.token = { uid: "devAccount" } as DecodedIdToken;
    next();
  }
});

app.get("/", (req, res) => {
  res.send(`Crate service backend, authenticated for ${req.token.uid}.`);
});

app.use("/ipfs", ipfs);
app.use("/pins", pinning);

const port = process.env.PORT || 3030;
app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});
