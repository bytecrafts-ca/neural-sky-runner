import type { VideoItem } from "../api/youtube";

/** Always-available catalog when remote APIs fail (glasses + Pages). */
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
    { id: "OPf0YbXqDm0", title: "Uptown Funk", channel: "Mark Ronson", thumbnail: "https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg" },
    { id: "RgKAFK5djSk", title: "See You Again", channel: "Wiz Khalifa", thumbnail: "https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg" },
  ],
  Gaming: [
    { id: "M7lc1UVf-VE", title: "YouTube Developers Live", channel: "YouTube", thumbnail: "https://i.ytimg.com/vi/M7lc1UVf-VE/mqdefault.jpg" },
    { id: "dQw4w9WgXcQ", title: "Rick Astley - Never Gonna Give You Up", channel: "Rick Astley", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
    { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed", thumbnail: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg" },
    { id: "9bZkp7q19f0", title: "Gangnam Style", channel: "PSY", thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg" },
  ],
  Tech: [
    { id: "M7lc1UVf-VE", title: "YouTube Developers", channel: "YouTube", thumbnail: "https://i.ytimg.com/vi/M7lc1UVf-VE/mqdefault.jpg" },
    { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed", thumbnail: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg" },
    { id: "kJQP7kiw5Fk", title: "Despacito", channel: "Luis Fonsi", thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg" },
  ],
  Sports: [
    { id: "OPf0YbXqDm0", title: "Uptown Funk", channel: "Mark Ronson", thumbnail: "https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg" },
    { id: "CevxZvSJLk8", title: "Roar", channel: "Katy Perry", thumbnail: "https://i.ytimg.com/vi/CevxZvSJLk8/mqdefault.jpg" },
    { id: "hT_nvWreIhg", title: "Counting Stars", channel: "OneRepublic", thumbnail: "https://i.ytimg.com/vi/hT_nvWreIhg/mqdefault.jpg" },
  ],
};

export function catalogForCategory(category: string): VideoItem[] {
  return VIDEO_CATALOG[category] ?? VIDEO_CATALOG.Trending;
}
