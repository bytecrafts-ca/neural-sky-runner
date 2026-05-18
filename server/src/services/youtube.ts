export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: number;
}

const PIPED = [
  "https://pipedapi.adminforge.de",
  "https://api.piped.yt",
  "https://pipedapi.leptons.xyz",
];

const YT_KEY = process.env.YOUTUBE_API_KEY;

export const VIDEO_CATALOG: Record<string, VideoItem[]> = {
  Trending: [
    { id: "kJQP7kiw5Fk", title: "Despacito", channel: "Luis Fonsi", thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg" },
    { id: "9bZkp7q19f0", title: "Gangnam Style", channel: "PSY", thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg" },
    { id: "RgKAFK5djSk", title: "See You Again", channel: "Wiz Khalifa", thumbnail: "https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg" },
    { id: "OPf0YbXqDm0", title: "Uptown Funk", channel: "Mark Ronson", thumbnail: "https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg" },
    { id: "JGwWNGJdvx8", title: "Shape of You", channel: "Ed Sheeran", thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg" },
    { id: "YQHsXMglC9A", title: "Hello", channel: "Adele", thumbnail: "https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg" },
    { id: "hT_nvWreIhg", title: "Counting Stars", channel: "OneRepublic", thumbnail: "https://i.ytimg.com/vi/hT_nvWreIhg/mqdefault.jpg" },
    { id: "CevxZvSJLk8", title: "Roar", channel: "Katy Perry", thumbnail: "https://i.ytimg.com/vi/CevxZvSJLk8/mqdefault.jpg" },
  ],
  Music: [
    { id: "kJQP7kiw5Fk", title: "Despacito", channel: "Luis Fonsi", thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg" },
    { id: "YQHsXMglC9A", title: "Hello", channel: "Adele", thumbnail: "https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg" },
    { id: "JGwWNGJdvx8", title: "Shape of You", channel: "Ed Sheeran", thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg" },
    { id: "hT_nvWreIhg", title: "Counting Stars", channel: "OneRepublic", thumbnail: "https://i.ytimg.com/vi/hT_nvWreIhg/mqdefault.jpg" },
  ],
  Gaming: [
    { id: "M7lc1UVf-VE", title: "YouTube Developers Live", channel: "YouTube", thumbnail: "https://i.ytimg.com/vi/M7lc1UVf-VE/mqdefault.jpg" },
    { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", channel: "Rick Astley", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
    { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed", thumbnail: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg" },
  ],
  Tech: [
    { id: "M7lc1UVf-VE", title: "YouTube Developers", channel: "YouTube", thumbnail: "https://i.ytimg.com/vi/M7lc1UVf-VE/mqdefault.jpg" },
    { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed", thumbnail: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg" },
  ],
  Sports: [
    { id: "OPf0YbXqDm0", title: "Uptown Funk", channel: "Mark Ronson", thumbnail: "https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg" },
    { id: "CevxZvSJLk8", title: "Roar", channel: "Katy Perry", thumbnail: "https://i.ytimg.com/vi/CevxZvSJLk8/mqdefault.jpg" },
  ],
};

export const FALLBACK_VIDEOS = VIDEO_CATALOG.Trending;

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function mapPiped(item: Record<string, unknown>): VideoItem | null {
  const id = String(item.url ?? item.id ?? "").replace(/.*v=/, "").replace(/.*\//, "");
  if (!id || id.length < 6) return null;
  return {
    id,
    title: String(item.title ?? "Video"),
    channel: String(item.uploaderName ?? item.uploader ?? "YouTube"),
    thumbnail: String(item.thumbnail ?? `https://i.ytimg.com/vi/${id}/mqdefault.jpg`),
    duration: typeof item.duration === "number" ? item.duration : undefined,
  };
}

async function piped<T>(path: string): Promise<T> {
  let last: unknown;
  for (const base of PIPED) {
    try {
      return (await fetchJson(`${base}${path}`)) as T;
    } catch (e) {
      last = e;
    }
  }
  throw last;
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

  if (VIDEO_CATALOG[q]) return VIDEO_CATALOG[q];

  if (YT_KEY) {
    try {
      const items = await searchYouTubeApi(q);
      if (items.length) return items;
    } catch {
      /* continue */
    }
  }

  try {
    const data = (await piped<{ items?: Record<string, unknown>[] }>(
      `/search?q=${encodeURIComponent(q)}&filter=videos`,
    )) as { items?: Record<string, unknown>[] };
    const items = (data.items ?? [])
      .map(mapPiped)
      .filter((v): v is VideoItem => v != null)
      .slice(0, 12);
    if (items.length) return items;
  } catch {
    /* catalog */
  }

  return VIDEO_CATALOG.Trending;
}

export async function trendingVideos(): Promise<VideoItem[]> {
  if (YT_KEY) {
    try {
      const url = new URL("https://www.googleapis.com/youtube/v3/videos");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("chart", "mostPopular");
      url.searchParams.set("maxResults", "12");
      url.searchParams.set("regionCode", "US");
      url.searchParams.set("key", YT_KEY);
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
      /* continue */
    }
  }

  try {
    const data = (await piped<Record<string, unknown>[]>("/trending?region=US")) ?? [];
    const items = data
      .map(mapPiped)
      .filter((v): v is VideoItem => v != null)
      .slice(0, 12);
    if (items.length) return items;
  } catch {
    /* catalog */
  }

  return VIDEO_CATALOG.Trending;
}
