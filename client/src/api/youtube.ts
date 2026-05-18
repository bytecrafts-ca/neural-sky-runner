import { VIDEO_CATALOG, catalogForCategory } from "../data/catalog";

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: number;
}

const API = import.meta.env.VITE_API_BASE ?? "";

async function fetchApi(path: string): Promise<VideoItem[] | null> {
  try {
    const res = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: VideoItem[] };
    return data.items?.length ? data.items : null;
  } catch {
    return null;
  }
}

export async function fetchTrending(): Promise<VideoItem[]> {
  const remote = await fetchApi("/api/youtube/trending");
  return remote ?? catalogForCategory("Trending");
}

export async function searchVideos(q: string): Promise<VideoItem[]> {
  const remote = await fetchApi(`/api/youtube/search?q=${encodeURIComponent(q)}`);
  if (remote) return remote;

  const cat = catalogForCategory(q);
  if (cat.length) return cat;

  const needle = q.toLowerCase();
  const all = Object.values(VIDEO_CATALOG).flat();
  const seen = new Set<string>();
  return all.filter((v) => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return v.title.toLowerCase().includes(needle) || v.channel.toLowerCase().includes(needle);
  });
}
