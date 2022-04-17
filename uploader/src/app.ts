import express from "express";
import dotenv from "dotenv";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.Console({ stderrLevels: ["error"] })],
});

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// (async () => {
//   const docRefs = await firestore.collection("users").listDocuments();
//   const docs = await Promise.all(docRefs.map(async (d) => d.get()));
//   console.log(docs.map((d) => d.data()));
// })();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});
