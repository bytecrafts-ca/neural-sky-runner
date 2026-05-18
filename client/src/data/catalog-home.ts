import type { FeedPage, VideoItem } from "../types/video";

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

export const HOME_CATALOG: VideoItem[] = [
  { id: "kJQP7kiw5Fk", title: "Despacito", channel: "Luis Fonsi", thumbnail: thumb("kJQP7kiw5Fk"), duration: "4:42", kind: "video" },
  { id: "9bZkp7q19f0", title: "Gangnam Style", channel: "PSY", thumbnail: thumb("9bZkp7q19f0"), duration: "4:13", kind: "video" },
  { id: "RgKAFK5djSk", title: "See You Again", channel: "Wiz Khalifa", thumbnail: thumb("RgKAFK5djSk"), duration: "3:58", kind: "video" },
  { id: "OPf0YbXqDm0", title: "Uptown Funk", channel: "Mark Ronson", thumbnail: thumb("OPf0YbXqDm0"), duration: "4:31", kind: "video" },
  { id: "JGwWNGJdvx8", title: "Shape of You", channel: "Ed Sheeran", thumbnail: thumb("JGwWNGJdvx8"), duration: "4:24", kind: "video" },
  { id: "YQHsXMglC9A", title: "Hello", channel: "Adele", thumbnail: thumb("YQHsXMglC9A"), duration: "6:07", kind: "video" },
  { id: "hT_nvWreIhg", title: "Counting Stars", channel: "OneRepublic", thumbnail: thumb("hT_nvWreIhg"), duration: "4:44", kind: "video" },
  { id: "CevxZvSJLk8", title: "Roar", channel: "Katy Perry", thumbnail: thumb("CevxZvSJLk8"), duration: "4:30", kind: "video" },
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", channel: "Rick Astley", thumbnail: thumb("dQw4w9WgXcQ"), duration: "3:33", kind: "video" },
  { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed", thumbnail: thumb("jNQXAC9IVRw"), duration: "0:19", kind: "video" },
  { id: "M7lc1UVf-VE", title: "YouTube Developers", channel: "YouTube", thumbnail: thumb("M7lc1UVf-VE"), duration: "3:11", kind: "video" },
  { id: "fJ9rUzIMcZQ", title: "Bohemian Rhapsody", channel: "Queen", thumbnail: thumb("fJ9rUzIMcZQ"), duration: "6:07", kind: "video" },
  { id: "y6120QOlsfU", title: "Sandstorm", channel: "Darude", thumbnail: thumb("y6120QOlsfU"), duration: "3:45", kind: "video" },
  { id: "L_jWHffIx5E", title: "Smells Like Teen Spirit", channel: "Nirvana", thumbnail: thumb("L_jWHffIx5E"), duration: "4:38", kind: "video" },
  { id: "60ItHLz5WEA", title: "Faded", channel: "Alan Walker", thumbnail: thumb("60ItHLz5WEA"), duration: "3:32", kind: "video" },
  { id: "kffacxfA7G4", title: "Baby Shark Dance", channel: "Pinkfong", thumbnail: thumb("kffacxfA7G4"), duration: "2:16", kind: "video" },
  { id: "nfWlot6h_JM", title: "Shake It Off", channel: "Taylor Swift", thumbnail: thumb("nfWlot6h_JM"), duration: "3:39", kind: "video" },
  { id: "09R8_2nJtjg", title: "Sugar", channel: "Maroon 5", thumbnail: thumb("09R8_2nJtjg"), duration: "3:55", kind: "video" },
  { id: "lp-EO5I60KA", title: "Thinking Out Loud", channel: "Ed Sheeran", thumbnail: thumb("lp-EO5I60KA"), duration: "4:41", kind: "video" },
  { id: "7wtfhZwyrcc", title: "Believer", channel: "Imagine Dragons", thumbnail: thumb("7wtfhZwyrcc"), duration: "3:24", kind: "video" },
  { id: "pRpeEdMmmQ0", title: "Waka Waka", channel: "Shakira", thumbnail: thumb("pRpeEdMmmQ0"), duration: "3:51", kind: "video" },
  { id: "uelHwf8Q7CI", title: "Love The Way You Lie", channel: "Eminem", thumbnail: thumb("uelHwf8Q7CI"), duration: "4:23", kind: "video" },
  { id: "2Vv-BfVoq4g", title: "Perfect", channel: "Ed Sheeran", thumbnail: thumb("2Vv-BfVoq4g"), duration: "4:23", kind: "video" },
  { id: "fRh_vgS2dFE", title: "Sorry", channel: "Justin Bieber", thumbnail: thumb("fRh_vgS2dFE"), duration: "3:20", kind: "video" },
  { id: "SlPhMPnQ58k", title: "Happier", channel: "Marshmello", thumbnail: thumb("SlPhMPnQ58k"), duration: "3:34", kind: "video" },
  { id: "e-ORhEE9XXg", title: "Blank Space", channel: "Taylor Swift", thumbnail: thumb("e-ORhEE9XXg"), duration: "4:32", kind: "video" },
  { id: "hLQl3WQEoRo", title: "Someone Like You", channel: "Adele", thumbnail: thumb("hLQl3WQEoRo"), duration: "4:45", kind: "video" },
  { id: "RBumgq5yV7A", title: "Let Her Go", channel: "Passenger", thumbnail: thumb("RBumgq5yV7A"), duration: "4:12", kind: "video" },
  { id: "450p7goxZqg", title: "All of Me", channel: "John Legend", thumbnail: thumb("450p7goxZqg"), duration: "4:30", kind: "video" },
  { id: "0KSOMA3QBU0", title: "Dark Horse", channel: "Katy Perry", thumbnail: thumb("0KSOMA3QBU0"), duration: "3:45", kind: "video" },
  { id: "YVkUvmDQ3HY", title: "Radioactive", channel: "Imagine Dragons", thumbnail: thumb("YVkUvmDQ3HY"), duration: "3:07", kind: "video" },
  { id: "1G4isv_Fylg", title: "Paradise", channel: "Coldplay", thumbnail: thumb("1G4isv_Fylg"), duration: "4:38", kind: "video" },
  { id: "hTWKbfoikeg", title: "Numb", channel: "Linkin Park", thumbnail: thumb("hTWKbfoikeg"), duration: "3:05", kind: "video" },
  { id: "Zi_XLOBDo_Y", title: "Billie Jean", channel: "Michael Jackson", thumbnail: thumb("Zi_XLOBDo_Y"), duration: "4:54", kind: "video" },
  { id: "pVuNs_rJlXk", title: "Chandelier", channel: "Sia", thumbnail: thumb("pVuNs_rJlXk"), duration: "3:36", kind: "video" },
  { id: "ktvTqknDobU", title: "Radioactive (Live)", channel: "Imagine Dragons", thumbnail: thumb("ktvTqknDobU"), duration: "4:21", kind: "video" },
  { id: "fLexgOxsZu0", title: "Cheap Thrills", channel: "Sia", thumbnail: thumb("fLexgOxsZu0"), duration: "3:52", kind: "video" },
  { id: "RubBzkZzpUA", title: "Stressed Out", channel: "Twenty One Pilots", thumbnail: thumb("RubBzkZzpUA"), duration: "3:22", kind: "video" },
  { id: "0e3GPea1Tyg", title: "Clarity", channel: "Zedd", thumbnail: thumb("0e3GPea1Tyg"), duration: "4:31", kind: "video" },
  { id: "7PCkvCPkDX0", title: "Lean On", channel: "Major Lazer", thumbnail: thumb("7PCkvCPkDX0"), duration: "2:56", kind: "video" },
  { id: "gCYcHz2k5x0", title: "Animals", channel: "Martin Garrix", thumbnail: thumb("gCYcHz2k5x0"), duration: "3:12", kind: "video" },
  { id: "FTQbiNvZqaY", title: "Titanium", channel: "David Guetta", thumbnail: thumb("FTQbiNvZqaY"), duration: "4:05", kind: "video" },
  { id: "hT_nvWreIhg", title: "Counting Stars (Live)", channel: "OneRepublic", thumbnail: thumb("hT_nvWreIhg"), duration: "5:12", kind: "video" },
  { id: "kXYiU_JCYtU", title: "Numb / Encore", channel: "Linkin Park", thumbnail: thumb("kXYiU_JCYtU"), duration: "3:28", kind: "video" },
  { id: "fukGbiPuBjU", title: "Gangsta's Paradise", channel: "Coolio", thumbnail: thumb("fukGbiPuBjU"), duration: "4:00", kind: "video" },
];

export const HOME_FILTERS: Record<string, VideoItem[]> = {
  All: HOME_CATALOG,
  Music: HOME_CATALOG.filter((_, i) => i % 3 === 0),
  Gaming: HOME_CATALOG.filter((_, i) => i % 3 === 1),
  Tech: HOME_CATALOG.filter((_, i) => i % 3 === 2),
};

export function paginateHome(filter: string, cursor: number, pageSize = 8): FeedPage {
  const pool = HOME_FILTERS[filter] ?? HOME_CATALOG;
  const start = cursor;
  const items = pool.slice(start, start + pageSize);
  const next = start + pageSize < pool.length ? String(start + pageSize) : null;
  if (!next && pool.length > 0 && start >= pool.length) {
    return paginateHome(filter, 0, pageSize);
  }
  return { items, nextCursor: next };
}
