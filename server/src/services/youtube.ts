export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: number;
}

const INVIDIOUS = [
  "https://yewtu.be",
  "https://vid.puffyan.us",
  "https://inv.nadeko.net",
];

const YT_KEY = process.env.YOUTUBE_API_KEY;

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function invidious<T>(path: string): Promise<T> {
  let lastErr: unknown;
  for (const base of INVIDIOUS) {
    try {
      return (await fetchJson(`${base}${path}`)) as T;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("Invidious unavailable");
}

function mapInvidiousItem(v: Record<string, unknown>): VideoItem | null {
  const id = String(v.videoId ?? v.video_id ?? "");
  if (!id) return null;
  const thumbs = v.videoThumbnails as { quality: string; url: string }[] | undefined;
  const thumb =
    thumbs?.find((t) => t.quality === "medium")?.url ??
    thumbs?.[0]?.url ??
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  return {
    id,
    title: String(v.title ?? "Untitled"),
    channel: String(v.author ?? v.authorId ?? "YouTube"),
    thumbnail: thumb,
    duration: typeof v.lengthSeconds === "number" ? v.lengthSeconds : undefined,
  };
}

async function searchYouTubeApi(q: string, max = 12): Promise<VideoItem[]> {
  if (!YT_KEY) return [];
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(max));
  url.searchParams.set("q", q);
  url.searchParams.set("key", YT_KEY);

  const data = (await fetchJson(url.toString())) as {
    items?: { id: { videoId: string }; snippet: Record<string, unknown> }[];
  };

  return (data.items ?? []).map((item) => ({
    id: item.id.videoId,
    title: String(item.snippet.title ?? ""),
    channel: String(item.snippet.channelTitle ?? ""),
    thumbnail:
      String((item.snippet.thumbnails as { medium?: { url: string } })?.medium?.url ?? "") ||
      `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
  }));
}

export async function searchVideos(query: string): Promise<VideoItem[]> {
  const q = query.trim();
  if (!q) return [];

  if (YT_KEY) {
    const items = await searchYouTubeApi(q);
    if (items.length) return items;
  }

  const data = (await invidious<unknown[]>(`/api/v1/search?q=${encodeURIComponent(q)}&type=video`)) ?? [];
  return data
    .map((row) => mapInvidiousItem(row as Record<string, unknown>))
    .filter((v): v is VideoItem => v != null)
    .slice(0, 12);
}

export async function trendingVideos(): Promise<VideoItem[]> {
  if (YT_KEY) {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("chart", "mostPopular");
    url.searchParams.set("maxResults", "12");
    url.searchParams.set("regionCode", "US");
    url.searchParams.set("key", YT_KEY);

    try {
      const data = (await fetchJson(url.toString())) as {
        items?: { id: string; snippet: Record<string, unknown> }[];
      };
      const items = (data.items ?? []).map((item) => ({
        id: item.id,
        title: String(item.snippet.title ?? ""),
        channel: String(item.snippet.channelTitle ?? ""),
        thumbnail:
          String((item.snippet.thumbnails as { medium?: { url: string } })?.medium?.url ?? "") ||
          `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`,
      }));
      if (items.length) return items;
    } catch {
      /* fall through */
    }
  }

  const data =
    (await invidious<{ type?: string; videos?: Record<string, unknown>[] }[]>(
      "/api/v1/trending?type=Default",
    )) ?? [];

  const videos = data.find((b) => b.type === "Default")?.videos ?? data[0]?.videos ?? [];
  return videos
    .map((row) => mapInvidiousItem(row))
    .filter((v): v is VideoItem => v != null)
    .slice(0, 12);
}

export const FALLBACK_VIDEOS: VideoItem[] = [
  {
    id: "jNQXAC9IVRw",
    title: "Me at the zoo",
    channel: "jawed",
    thumbnail: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg",
  },
  {
    id: "9bZkp7q19f0",
    title: "Gangnam Style",
    channel: "officialpsy",
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg",
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Despacito",
    channel: "Luis Fonsi",
    thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
  },
];
