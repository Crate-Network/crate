import express from "express";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

import ipfs from "./routes/ipfs";
import pinning from "./routes/pinning-backend";
import logger from "./logger";

const args = process.argv.slice(2);

const firebaseApp = initializeApp({
  credential: applicationDefault(),
});
const firestore = getFirestore(firebaseApp);
const auth = getAuth();

const app = express();

if (!args.includes("--dev")) {
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
  });
}

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/ipfs", ipfs);
app.use("/pins", pinning);

const port = process.env.PORT || 3030;
app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});
