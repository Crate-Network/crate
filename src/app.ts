import express from "express";
import fetch from "node-fetch";

const app = express();

(async () => {
  const res = await fetch(
    "https://2526cn5iroQNHchN3wbVgoWcyKd:2b3a78f8c9e5e2ea597ee65d7a42aa8f@filecoin.infura.io/",
    {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "Filecoin.WalletBalance",
        params: [],
      }),
    }
  );
  const json = await res.json();
  console.log(json);
})();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(process.env.PORT || 3000);
