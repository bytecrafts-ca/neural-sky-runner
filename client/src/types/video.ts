export type VideoKind = "video" | "short";

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: string;
  kind?: VideoKind;
}

export interface FeedPage {
  items: VideoItem[];
  nextCursor: string | null;
}
