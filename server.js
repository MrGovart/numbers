import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname);

app.use(express.json());
app.use("/", express.static("src/public", { index: "./index.html" }));

app.get("/animejs", (req, res) => {
  res.sendFile("/node_modules/animejs/lib/anime.es.js", { root: root });
});

http.createServer(app).listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
