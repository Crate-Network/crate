import { Router } from "express";
import logger from "../logger";
import { uuid } from "uuidv4";

const router = Router();

router.get("/", (req, res) => {
  const fcRes = "List of pin objects.";
  res.send(fcRes);
});

router.post("/", (req, res) => {
  console.log(req.body);
  const fcRes = "Add a pin object.";
  res.send({
    requestid: uuid(),
    status: "queued",
    created: new Date().toISOString(),
    pin: {},
  });
});

router.get(/\/(.+)$/, (req, res) => {
  const reqId = req.params[0];
  const fcRes = `Get pin object with ID ${reqId}.`;
  res.send(fcRes);
});

router.post(/\/(.+)$/, (req, res) => {
  const reqId = req.params[0];
  const fcRes = `Replace pin object with ID ${reqId}.`;
  res.send(fcRes);
});

router.delete(/\/(.+)$/, (req, res) => {
  const reqId = req.params[0];
  const fcRes = `Remove pin object with ID ${reqId}.`;
  res.send(fcRes);
});

export default router;
