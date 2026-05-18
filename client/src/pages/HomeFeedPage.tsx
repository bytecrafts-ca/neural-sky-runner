import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadFeed } from "../api/youtube";
import { FeedCard } from "../components/FeedCard";
import { GestureHud } from "../components/GestureHud";
import { useFeedScroll } from "../hooks/useFeedScroll";
import { useGestureNav } from "../hooks/useGestureNav";
import type { Gesture } from "../metaWearables";
import type { VideoItem } from "../types/video";

const FILTERS = ["All", "Music", "Gaming", "Tech"];

export function HomeFeedPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { scrollByGesture } = useFeedScroll(scrollRef);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [cursor, setCursor] = useState("0");
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("All");
  const [focus, setFocus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastGesture, setLastGesture] = useState<Gesture | null>(null);

  const appendPage = useCallback(
    async (nextCursor: string, reset: boolean, activeFilter: string) => {
      setLoading(true);
      const page = await loadFeed("home", nextCursor, activeFilter);
      setVideos((prev) => (reset ? page.items : [...prev, ...page.items]));
      setCursor(page.nextCursor ?? "0");
      setHasMore(page.nextCursor != null);
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    setFocus(0);
    void appendPage("0", true, filter);
  }, [filter, appendPage]);

  useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target || !hasMore) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasMore) {
          void appendPage(cursor, false, filter);
        }
      },
      { root, rootMargin: "120px" },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [appendPage, cursor, filter, hasMore, loading]);

  useEffect(() => {
    const el = scrollRef.current?.querySelector(".feed-card--focus");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focus]);

  const openVideo = useCallback(
    (index: number) => {
      const v = videos[index];
      if (!v) return;
      navigate(`/watch/${v.id}`, {
        state: { video: v, queue: videos, index, from: "home" },
      });
    },
    [navigate, videos],
  );

  const handleGesture = useCallback(
    (type: Gesture) => {
      setLastGesture(type);

      if (type === "tap") {
        openVideo(focus);
        return;
      }

      if (type === "swipe_left") {
        navigate("/shorts");
        return;
      }

      if (type === "swipe_right") return;

      if (type === "swipe_up") {
        scrollByGesture("up");
        setFocus((i) => Math.max(0, i - 1));
        return;
      }

      if (type === "swipe_down") {
        scrollByGesture("down");
        setFocus((i) => Math.min(videos.length - 1, i + 1));
      }
    },
    [focus, navigate, openVideo, scrollByGesture, videos.length],
  );

  useGestureNav(handleGesture);

  return (
    <div className="page home-feed">
      <header className="glass-bar">
        <h1>YouTube</h1>
        <p>Swipe ↓ to scroll · Tap to watch · ← Shorts</p>
      </header>

      <div className="chip-row">
        {FILTERS.map((label) => (
          <button
            key={label}
            type="button"
            className={`chip${filter === label ? " chip--active" : ""}`}
            onClick={() => setFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="feed-scroll" ref={scrollRef}>
        {videos.map((video, i) => (
          <FeedCard
            key={`${video.id}-${i}`}
            video={video}
            focused={i === focus}
            onSelect={() => openVideo(i)}
          />
        ))}
        <div ref={sentinelRef} className="feed-sentinel">
          {loading ? "Loading…" : hasMore ? "Scroll for more" : "You're all caught up"}
        </div>
      </div>

      <GestureHud hint="↓ scroll · tap watch · ← shorts" last={lastGesture} />
    </div>
  );
}
