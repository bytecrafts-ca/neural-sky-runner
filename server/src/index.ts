import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "neural-sky-runner" });
});

const clientDist = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDist));

app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Neural Sky Runner -> http://localhost:${PORT}`);
});
