export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: number;
}

const API = import.meta.env.VITE_API_BASE ?? "";

export async function fetchTrending(): Promise<VideoItem[]> {
  const res = await fetch(`${API}/api/youtube/trending`);
  if (!res.ok) throw new Error("Failed to load videos");
  const data = (await res.json()) as { items: VideoItem[] };
  return data.items;
}

export async function searchVideos(q: string): Promise<VideoItem[]> {
  const res = await fetch(`${API}/api/youtube/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("Search failed");
  const data = (await res.json()) as { items: VideoItem[] };
  return data.items;
}
