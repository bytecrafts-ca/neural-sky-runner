import type { FeedPage, VideoItem } from "../types/video";

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const SHORTS_CATALOG: VideoItem[] = [
  { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed", thumbnail: thumb("jNQXAC9IVRw"), duration: "0:19", kind: "short" },
  { id: "kffacxfA7G4", title: "Baby Shark", channel: "Pinkfong", thumbnail: thumb("kffacxfA7G4"), duration: "0:45", kind: "short" },
  { id: "dQw4w9WgXcQ", title: "Rick Roll", channel: "Rick Astley", thumbnail: thumb("dQw4w9WgXcQ"), duration: "0:33", kind: "short" },
  { id: "7PCkvCPkDX0", title: "Lean On", channel: "Major Lazer", thumbnail: thumb("7PCkvCPkDX0"), duration: "0:58", kind: "short" },
  { id: "gCYcHz2k5x0", title: "Animals", channel: "Martin Garrix", thumbnail: thumb("gCYcHz2k5x0"), duration: "0:42", kind: "short" },
  { id: "M7lc1UVf-VE", title: "YouTube Demo", channel: "YouTube", thumbnail: thumb("M7lc1UVf-VE"), duration: "0:30", kind: "short" },
  { id: "y6120QOlsfU", title: "Sandstorm clip", channel: "Darude", thumbnail: thumb("y6120QOlsfU"), duration: "0:28", kind: "short" },
  { id: "60ItHLz5WEA", title: "Faded clip", channel: "Alan Walker", thumbnail: thumb("60ItHLz5WEA"), duration: "0:35", kind: "short" },
  { id: "7wtfhZwyrcc", title: "Believer clip", channel: "Imagine Dragons", thumbnail: thumb("7wtfhZwyrcc"), duration: "0:40", kind: "short" },
  { id: "SlPhMPnQ58k", title: "Happier clip", channel: "Marshmello", thumbnail: thumb("SlPhMPnQ58k"), duration: "0:38", kind: "short" },
  { id: "RubBzkZzpUA", title: "Stressed Out clip", channel: "TOP", thumbnail: thumb("RubBzkZzpUA"), duration: "0:32", kind: "short" },
  { id: "0e3GPea1Tyg", title: "Clarity clip", channel: "Zedd", thumbnail: thumb("0e3GPea1Tyg"), duration: "0:45", kind: "short" },
  { id: "FTQbiNvZqaY", title: "Titanium clip", channel: "David Guetta", thumbnail: thumb("FTQbiNvZqaY"), duration: "0:36", kind: "short" },
  { id: "fLexgOxsZu0", title: "Cheap Thrills clip", channel: "Sia", thumbnail: thumb("fLexgOxsZu0"), duration: "0:41", kind: "short" },
  { id: "pVuNs_rJlXk", title: "Chandelier clip", channel: "Sia", thumbnail: thumb("pVuNs_rJlXk"), duration: "0:39", kind: "short" },
  { id: "fRh_vgS2dFE", title: "Sorry clip", channel: "Justin Bieber", thumbnail: thumb("fRh_vgS2dFE"), duration: "0:33", kind: "short" },
  { id: "nfWlot6h_JM", title: "Shake It Off clip", channel: "Taylor Swift", thumbnail: thumb("nfWlot6h_JM"), duration: "0:37", kind: "short" },
  { id: "e-ORhEE9XXg", title: "Blank Space clip", channel: "Taylor Swift", thumbnail: thumb("e-ORhEE9XXg"), duration: "0:44", kind: "short" },
  { id: "RBumgq5yV7A", title: "Let Her Go clip", channel: "Passenger", thumbnail: thumb("RBumgq5yV7A"), duration: "0:31", kind: "short" },
  { id: "450p7goxZqg", title: "All of Me clip", channel: "John Legend", thumbnail: thumb("450p7goxZqg"), duration: "0:42", kind: "short" },
  { id: "0KSOMA3QBU0", title: "Dark Horse clip", channel: "Katy Perry", thumbnail: thumb("0KSOMA3QBU0"), duration: "0:35", kind: "short" },
  { id: "YVkUvmDQ3HY", title: "Radioactive clip", channel: "Imagine Dragons", thumbnail: thumb("YVkUvmDQ3HY"), duration: "0:29", kind: "short" },
  { id: "1G4isv_Fylg", title: "Paradise clip", channel: "Coldplay", thumbnail: thumb("1G4isv_Fylg"), duration: "0:38", kind: "short" },
  { id: "hTWKbfoikeg", title: "Numb clip", channel: "Linkin Park", thumbnail: thumb("hTWKbfoikeg"), duration: "0:34", kind: "short" },
  { id: "Zi_XLOBDo_Y", title: "Billie Jean clip", channel: "Michael Jackson", thumbnail: thumb("Zi_XLOBDo_Y"), duration: "0:40", kind: "short" },
  { id: "ktvTqknDobU", title: "Live clip", channel: "Imagine Dragons", thumbnail: thumb("ktvTqknDobU"), duration: "0:36", kind: "short" },
  { id: "fukGbiPuBjU", title: "Gangsta Paradise", channel: "Coolio", thumbnail: thumb("fukGbiPuBjU"), duration: "0:43", kind: "short" },
  { id: "kXYiU_JCYtU", title: "Numb encore", channel: "Linkin Park", thumbnail: thumb("kXYiU_JCYtU"), duration: "0:32", kind: "short" },
  { id: "09R8_2nJtjg", title: "Sugar clip", channel: "Maroon 5", thumbnail: thumb("09R8_2nJtjg"), duration: "0:37", kind: "short" },
  { id: "2Vv-BfVoq4g", title: "Perfect clip", channel: "Ed Sheeran", thumbnail: thumb("2Vv-BfVoq4g"), duration: "0:41", kind: "short" },
  { id: "uelHwf8Q7CI", title: "Eminem clip", channel: "Eminem", thumbnail: thumb("uelHwf8Q7CI"), duration: "0:39", kind: "short" },
  { id: "pRpeEdMmmQ0", title: "Waka Waka clip", channel: "Shakira", thumbnail: thumb("pRpeEdMmmQ0"), duration: "0:34", kind: "short" },
  { id: "CevxZvSJLk8", title: "Roar clip", channel: "Katy Perry", thumbnail: thumb("CevxZvSJLk8"), duration: "0:38", kind: "short" },
];

export function paginateShorts(cursor: number, pageSize = 6): FeedPage {
  const start = cursor;
  const items = SHORTS_CATALOG.slice(start, start + pageSize);
  let next: string | null = start + pageSize < SHORTS_CATALOG.length ? String(start + pageSize) : null;
  if (!next && start >= SHORTS_CATALOG.length) {
    return paginateShorts(0, pageSize);
  }
  return { items, nextCursor: next };
}
