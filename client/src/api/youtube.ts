import { paginateHome } from "../data/catalog-home";
import { paginateShorts } from "../data/catalog-shorts";
import type { FeedPage, VideoItem } from "../types/video";

const API = import.meta.env.VITE_API_BASE ?? "";

async function fetchFeedRemote(
  feed: "home" | "shorts",
  cursor: string,
  filter: string,
): Promise<FeedPage | null> {
  try {
    const params = new URLSearchParams({ feed, cursor, filter });
    const res = await fetch(`${API}/api/youtube/feed?${params}`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as FeedPage;
  } catch {
    return null;
  }
}

function localFeed(feed: "home" | "shorts", cursor: string, filter: string): FeedPage {
  const n = Number.parseInt(cursor, 10) || 0;
  if (feed === "shorts") return paginateShorts(n);
  return paginateHome(filter, n);
}

export async function loadFeed(
  feed: "home" | "shorts",
  cursor: string,
  filter = "All",
): Promise<FeedPage> {
  const remote = await fetchFeedRemote(feed, cursor, filter);
  if (remote?.items.length) return remote;
  return localFeed(feed, cursor, filter);
}

export type { VideoItem, FeedPage };
