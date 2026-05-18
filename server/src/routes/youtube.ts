import { Router } from "express";
import { FALLBACK_VIDEOS, searchVideos, trendingVideos } from "../services/youtube.js";

export const youtubeRouter = Router();

youtubeRouter.get("/trending", async (_req, res) => {
  try {
    const items = await trendingVideos();
    res.json({ items: items.length ? items : FALLBACK_VIDEOS });
  } catch {
    res.json({ items: FALLBACK_VIDEOS });
  }
});

youtubeRouter.get("/search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    res.json({ items: [] });
    return;
  }
  try {
    const items = await searchVideos(q);
    res.json({ items: items.length ? items : FALLBACK_VIDEOS });
  } catch {
    res.json({ items: FALLBACK_VIDEOS });
  }
});
