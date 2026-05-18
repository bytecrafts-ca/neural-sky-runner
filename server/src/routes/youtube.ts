import { Router } from "express";
import { paginateFeed } from "../data/catalog.js";

export const youtubeRouter = Router();

youtubeRouter.get("/feed", (req, res) => {
  const feed = req.query.feed === "shorts" ? "shorts" : "home";
  const filter = String(req.query.filter ?? "All");
  const cursor = Number.parseInt(String(req.query.cursor ?? "0"), 10) || 0;
  const pageSize = feed === "shorts" ? 6 : 8;
  res.json(paginateFeed(feed, filter, cursor, pageSize));
});

youtubeRouter.get("/shorts", (req, res) => {
  const cursor = Number.parseInt(String(req.query.cursor ?? "0"), 10) || 0;
  res.json(paginateFeed("shorts", "All", cursor, 6));
});

youtubeRouter.get("/trending", (req, res) => {
  res.json(paginateFeed("home", "All", 0, 8));
});

youtubeRouter.get("/search", (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const filter = ["All", "Music", "Gaming", "Tech"].includes(q) ? q : "All";
  res.json(paginateFeed("home", filter, 0, 12));
});
