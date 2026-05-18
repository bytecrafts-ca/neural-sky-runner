import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrending, searchVideos, type VideoItem } from "../api/youtube";
import { GestureHud } from "../components/GestureHud";
import { VideoCard } from "../components/VideoCard";
import { useGestureNav } from "../hooks/useGestureNav";
import type { Gesture } from "../metaWearables";

const CATEGORIES = ["Trending", "Music", "Gaming", "Tech", "Sports"];

export function HomePage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(0);
  const [focus, setFocus] = useState(0);
  const [lastGesture, setLastGesture] = useState<Gesture | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const cols = 2;

  const load = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const items = query === "Trending" ? await fetchTrending() : await searchVideos(query);
      setVideos(items);
      setFocus(0);
    } catch {
      const { catalogForCategory } = await import("../data/catalog");
      const items = catalogForCategory(query);
      setVideos(items);
      setError(items.length ? null : "No videos available.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(CATEGORIES[category]);
  }, [category, load]);

  useEffect(() => {
    const el = listRef.current?.querySelector(".video-card--focus");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focus, videos]);

  const openFocused = useCallback(() => {
    const v = videos[focus];
    if (v) navigate(`/watch/${v.id}`, { state: { video: v } });
  }, [focus, navigate, videos]);

  const handleGesture = useCallback(
    (type: Gesture) => {
      setLastGesture(type);

      if (type === "tap") {
        openFocused();
        return;
      }

      if (type === "hold") return;

      if (type === "swipe_left") {
        setFocus((i) => Math.max(0, i - 1));
        return;
      }

      if (type === "swipe_right") {
        setFocus((i) => Math.min(videos.length - 1, i + 1));
        return;
      }

      if (type === "swipe_up") {
        setFocus((i) => Math.max(0, i - cols));
        return;
      }

      if (type === "swipe_down") {
        setFocus((i) => Math.min(videos.length - 1, i + cols));
      }
    },
    [cols, openFocused, videos.length],
  );

  useGestureNav(handleGesture);

  return (
    <div className="page home-page">
      <header className="glass-bar">
        <h1>YouTube Lens</h1>
        <p>Neural Band · swipe to browse · tap to watch</p>
      </header>

      <div className="chip-row" role="tablist">
        {CATEGORIES.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            className={`chip${category === i ? " chip--active" : ""}`}
            aria-selected={category === i}
            onClick={() => setCategory(i)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="status">Loading…</p>}
      {error && <p className="status status--error">{error}</p>}

      <div className="video-grid" ref={listRef}>
        {videos.map((video, i) => (
          <VideoCard
            key={video.id}
            video={video}
            focused={i === focus}
            onSelect={() => navigate(`/watch/${video.id}`, { state: { video } })}
          />
        ))}
      </div>

      <GestureHud last={lastGesture} />
    </div>
  );
}
