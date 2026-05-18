export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: string;
  kind?: "video" | "short";
}

const t = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

export const HOME_CATALOG: VideoItem[] = [
  { id: "kJQP7kiw5Fk", title: "Despacito", channel: "Luis Fonsi", thumbnail: t("kJQP7kiw5Fk"), duration: "4:42", kind: "video" },
  { id: "9bZkp7q19f0", title: "Gangnam Style", channel: "PSY", thumbnail: t("9bZkp7q19f0"), duration: "4:13", kind: "video" },
  { id: "RgKAFK5djSk", title: "See You Again", channel: "Wiz Khalifa", thumbnail: t("RgKAFK5djSk"), duration: "3:58", kind: "video" },
  { id: "OPf0YbXqDm0", title: "Uptown Funk", channel: "Mark Ronson", thumbnail: t("OPf0YbXqDm0"), duration: "4:31", kind: "video" },
  { id: "JGwWNGJdvx8", title: "Shape of You", channel: "Ed Sheeran", thumbnail: t("JGwWNGJdvx8"), duration: "4:24", kind: "video" },
  { id: "YQHsXMglC9A", title: "Hello", channel: "Adele", thumbnail: t("YQHsXMglC9A"), duration: "6:07", kind: "video" },
  { id: "hT_nvWreIhg", title: "Counting Stars", channel: "OneRepublic", thumbnail: t("hT_nvWreIhg"), duration: "4:44", kind: "video" },
  { id: "CevxZvSJLk8", title: "Roar", channel: "Katy Perry", thumbnail: t("CevxZvSJLk8"), duration: "4:30", kind: "video" },
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", channel: "Rick Astley", thumbnail: t("dQw4w9WgXcQ"), duration: "3:33", kind: "video" },
  { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed", thumbnail: t("jNQXAC9IVRw"), duration: "0:19", kind: "video" },
  { id: "M7lc1UVf-VE", title: "YouTube Developers", channel: "YouTube", thumbnail: t("M7lc1UVf-VE"), duration: "3:11", kind: "video" },
  { id: "fJ9rUzIMcZQ", title: "Bohemian Rhapsody", channel: "Queen", thumbnail: t("fJ9rUzIMcZQ"), duration: "6:07", kind: "video" },
  { id: "y6120QOlsfU", title: "Sandstorm", channel: "Darude", thumbnail: t("y6120QOlsfU"), duration: "3:45", kind: "video" },
  { id: "L_jWHffIx5E", title: "Smells Like Teen Spirit", channel: "Nirvana", thumbnail: t("L_jWHffIx5E"), duration: "4:38", kind: "video" },
  { id: "60ItHLz5WEA", title: "Faded", channel: "Alan Walker", thumbnail: t("60ItHLz5WEA"), duration: "3:32", kind: "video" },
  { id: "kffacxfA7G4", title: "Baby Shark Dance", channel: "Pinkfong", thumbnail: t("kffacxfA7G4"), duration: "2:16", kind: "video" },
  { id: "nfWlot6h_JM", title: "Shake It Off", channel: "Taylor Swift", thumbnail: t("nfWlot6h_JM"), duration: "3:39", kind: "video" },
  { id: "09R8_2nJtjg", title: "Sugar", channel: "Maroon 5", thumbnail: t("09R8_2nJtjg"), duration: "3:55", kind: "video" },
  { id: "lp-EO5I60KA", title: "Thinking Out Loud", channel: "Ed Sheeran", thumbnail: t("lp-EO5I60KA"), duration: "4:41", kind: "video" },
  { id: "7wtfhZwyrcc", title: "Believer", channel: "Imagine Dragons", thumbnail: t("7wtfhZwyrcc"), duration: "3:24", kind: "video" },
  { id: "pRpeEdMmmQ0", title: "Waka Waka", channel: "Shakira", thumbnail: t("pRpeEdMmmQ0"), duration: "3:51", kind: "video" },
  { id: "uelHwf8Q7CI", title: "Love The Way You Lie", channel: "Eminem", thumbnail: t("uelHwf8Q7CI"), duration: "4:23", kind: "video" },
  { id: "2Vv-BfVoq4g", title: "Perfect", channel: "Ed Sheeran", thumbnail: t("2Vv-BfVoq4g"), duration: "4:23", kind: "video" },
  { id: "fRh_vgS2dFE", title: "Sorry", channel: "Justin Bieber", thumbnail: t("fRh_vgS2dFE"), duration: "3:20", kind: "video" },
  { id: "SlPhMPnQ58k", title: "Happier", channel: "Marshmello", thumbnail: t("SlPhMPnQ58k"), duration: "3:34", kind: "video" },
  { id: "e-ORhEE9XXg", title: "Blank Space", channel: "Taylor Swift", thumbnail: t("e-ORhEE9XXg"), duration: "4:32", kind: "video" },
  { id: "hLQl3WQEoRo", title: "Someone Like You", channel: "Adele", thumbnail: t("hLQl3WQEoRo"), duration: "4:45", kind: "video" },
  { id: "RBumgq5yV7A", title: "Let Her Go", channel: "Passenger", thumbnail: t("RBumgq5yV7A"), duration: "4:12", kind: "video" },
  { id: "450p7goxZqg", title: "All of Me", channel: "John Legend", thumbnail: t("450p7goxZqg"), duration: "4:30", kind: "video" },
  { id: "0KSOMA3QBU0", title: "Dark Horse", channel: "Katy Perry", thumbnail: t("0KSOMA3QBU0"), duration: "3:45", kind: "video" },
  { id: "YVkUvmDQ3HY", title: "Radioactive", channel: "Imagine Dragons", thumbnail: t("YVkUvmDQ3HY"), duration: "3:07", kind: "video" },
  { id: "1G4isv_Fylg", title: "Paradise", channel: "Coldplay", thumbnail: t("1G4isv_Fylg"), duration: "4:38", kind: "video" },
  { id: "hTWKbfoikeg", title: "Numb", channel: "Linkin Park", thumbnail: t("hTWKbfoikeg"), duration: "3:05", kind: "video" },
  { id: "Zi_XLOBDo_Y", title: "Billie Jean", channel: "Michael Jackson", thumbnail: t("Zi_XLOBDo_Y"), duration: "4:54", kind: "video" },
  { id: "pVuNs_rJlXk", title: "Chandelier", channel: "Sia", thumbnail: t("pVuNs_rJlXk"), duration: "3:36", kind: "video" },
  { id: "ktvTqknDobU", title: "Radioactive (Live)", channel: "Imagine Dragons", thumbnail: t("ktvTqknDobU"), duration: "4:21", kind: "video" },
  { id: "fLexgOxsZu0", title: "Cheap Thrills", channel: "Sia", thumbnail: t("fLexgOxsZu0"), duration: "3:52", kind: "video" },
  { id: "RubBzkZzpUA", title: "Stressed Out", channel: "Twenty One Pilots", thumbnail: t("RubBzkZzpUA"), duration: "3:22", kind: "video" },
  { id: "0e3GPea1Tyg", title: "Clarity", channel: "Zedd", thumbnail: t("0e3GPea1Tyg"), duration: "4:31", kind: "video" },
  { id: "7PCkvCPkDX0", title: "Lean On", channel: "Major Lazer", thumbnail: t("7PCkvCPkDX0"), duration: "2:56", kind: "video" },
  { id: "gCYcHz2k5x0", title: "Animals", channel: "Martin Garrix", thumbnail: t("gCYcHz2k5x0"), duration: "3:12", kind: "video" },
  { id: "FTQbiNvZqaY", title: "Titanium", channel: "David Guetta", thumbnail: t("FTQbiNvZqaY"), duration: "4:05", kind: "video" },
  { id: "fukGbiPuBjU", title: "Gangsta's Paradise", channel: "Coolio", thumbnail: t("fukGbiPuBjU"), duration: "4:00", kind: "video" },
  { id: "kXYiU_JCYtU", title: "Numb / Encore", channel: "Linkin Park", thumbnail: t("kXYiU_JCYtU"), duration: "3:28", kind: "video" },
];

export const SHORTS_CATALOG: VideoItem[] = [
  { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed", thumbnail: t("jNQXAC9IVRw"), duration: "0:19", kind: "short" },
  { id: "kffacxfA7G4", title: "Baby Shark", channel: "Pinkfong", thumbnail: t("kffacxfA7G4"), duration: "0:45", kind: "short" },
  { id: "dQw4w9WgXcQ", title: "Rick Roll", channel: "Rick Astley", thumbnail: t("dQw4w9WgXcQ"), duration: "0:33", kind: "short" },
  { id: "7PCkvCPkDX0", title: "Lean On", channel: "Major Lazer", thumbnail: t("7PCkvCPkDX0"), duration: "0:58", kind: "short" },
  { id: "gCYcHz2k5x0", title: "Animals", channel: "Martin Garrix", thumbnail: t("gCYcHz2k5x0"), duration: "0:42", kind: "short" },
  { id: "M7lc1UVf-VE", title: "YouTube Demo", channel: "YouTube", thumbnail: t("M7lc1UVf-VE"), duration: "0:30", kind: "short" },
  { id: "y6120QOlsfU", title: "Sandstorm clip", channel: "Darude", thumbnail: t("y6120QOlsfU"), duration: "0:28", kind: "short" },
  { id: "60ItHLz5WEA", title: "Faded clip", channel: "Alan Walker", thumbnail: t("60ItHLz5WEA"), duration: "0:35", kind: "short" },
  { id: "7wtfhZwyrcc", title: "Believer clip", channel: "Imagine Dragons", thumbnail: t("7wtfhZwyrcc"), duration: "0:40", kind: "short" },
  { id: "SlPhMPnQ58k", title: "Happier clip", channel: "Marshmello", thumbnail: t("SlPhMPnQ58k"), duration: "0:38", kind: "short" },
  { id: "RubBzkZzpUA", title: "Stressed Out clip", channel: "TOP", thumbnail: t("RubBzkZzpUA"), duration: "0:32", kind: "short" },
  { id: "0e3GPea1Tyg", title: "Clarity clip", channel: "Zedd", thumbnail: t("0e3GPea1Tyg"), duration: "0:45", kind: "short" },
  { id: "FTQbiNvZqaY", title: "Titanium clip", channel: "David Guetta", thumbnail: t("FTQbiNvZqaY"), duration: "0:36", kind: "short" },
  { id: "fLexgOxsZu0", title: "Cheap Thrills clip", channel: "Sia", thumbnail: t("fLexgOxsZu0"), duration: "0:41", kind: "short" },
  { id: "pVuNs_rJlXk", title: "Chandelier clip", channel: "Sia", thumbnail: t("pVuNs_rJlXk"), duration: "0:39", kind: "short" },
  { id: "fRh_vgS2dFE", title: "Sorry clip", channel: "Justin Bieber", thumbnail: t("fRh_vgS2dFE"), duration: "0:33", kind: "short" },
  { id: "nfWlot6h_JM", title: "Shake It Off clip", channel: "Taylor Swift", thumbnail: t("nfWlot6h_JM"), duration: "0:37", kind: "short" },
  { id: "e-ORhEE9XXg", title: "Blank Space clip", channel: "Taylor Swift", thumbnail: t("e-ORhEE9XXg"), duration: "0:44", kind: "short" },
  { id: "RBumgq5yV7A", title: "Let Her Go clip", channel: "Passenger", thumbnail: t("RBumgq5yV7A"), duration: "0:31", kind: "short" },
  { id: "450p7goxZqg", title: "All of Me clip", channel: "John Legend", thumbnail: t("450p7goxZqg"), duration: "0:42", kind: "short" },
  { id: "0KSOMA3QBU0", title: "Dark Horse clip", channel: "Katy Perry", thumbnail: t("0KSOMA3QBU0"), duration: "0:35", kind: "short" },
  { id: "YVkUvmDQ3HY", title: "Radioactive clip", channel: "Imagine Dragons", thumbnail: t("YVkUvmDQ3HY"), duration: "0:29", kind: "short" },
  { id: "1G4isv_Fylg", title: "Paradise clip", channel: "Coldplay", thumbnail: t("1G4isv_Fylg"), duration: "0:38", kind: "short" },
  { id: "hTWKbfoikeg", title: "Numb clip", channel: "Linkin Park", thumbnail: t("hTWKbfoikeg"), duration: "0:34", kind: "short" },
  { id: "Zi_XLOBDo_Y", title: "Billie Jean clip", channel: "Michael Jackson", thumbnail: t("Zi_XLOBDo_Y"), duration: "0:40", kind: "short" },
  { id: "ktvTqknDobU", title: "Live clip", channel: "Imagine Dragons", thumbnail: t("ktvTqknDobU"), duration: "0:36", kind: "short" },
  { id: "fukGbiPuBjU", title: "Gangsta Paradise", channel: "Coolio", thumbnail: t("fukGbiPuBjU"), duration: "0:43", kind: "short" },
  { id: "kXYiU_JCYtU", title: "Numb encore", channel: "Linkin Park", thumbnail: t("kXYiU_JCYtU"), duration: "0:32", kind: "short" },
  { id: "09R8_2nJtjg", title: "Sugar clip", channel: "Maroon 5", thumbnail: t("09R8_2nJtjg"), duration: "0:37", kind: "short" },
  { id: "2Vv-BfVoq4g", title: "Perfect clip", channel: "Ed Sheeran", thumbnail: t("2Vv-BfVoq4g"), duration: "0:41", kind: "short" },
  { id: "uelHwf8Q7CI", title: "Eminem clip", channel: "Eminem", thumbnail: t("uelHwf8Q7CI"), duration: "0:39", kind: "short" },
  { id: "pRpeEdMmmQ0", title: "Waka Waka clip", channel: "Shakira", thumbnail: t("pRpeEdMmmQ0"), duration: "0:34", kind: "short" },
  { id: "CevxZvSJLk8", title: "Roar clip", channel: "Katy Perry", thumbnail: t("CevxZvSJLk8"), duration: "0:38", kind: "short" },
];

const HOME_FILTERS: Record<string, VideoItem[]> = {
  All: HOME_CATALOG,
  Music: HOME_CATALOG.filter((_, i) => i % 3 === 0),
  Gaming: HOME_CATALOG.filter((_, i) => i % 3 === 1),
  Tech: HOME_CATALOG.filter((_, i) => i % 3 === 2),
};

export function paginateFeed(
  feed: "home" | "shorts",
  filter: string,
  cursor: number,
  pageSize: number,
) {
  const pool =
    feed === "shorts" ? SHORTS_CATALOG : (HOME_FILTERS[filter] ?? HOME_CATALOG);
  const start = cursor;
  const items = pool.slice(start, start + pageSize);
  let nextCursor = start + pageSize < pool.length ? String(start + pageSize) : null;
  if (!nextCursor && pool.length > 0 && start >= pool.length) {
    return paginateFeed(feed, filter, 0, pageSize);
  }
  return { items, nextCursor };
}
