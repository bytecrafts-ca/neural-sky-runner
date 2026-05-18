import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadFeed } from "../api/youtube";
import { GestureHud } from "../components/GestureHud";
import { ShortCard } from "../components/ShortCard";
import { useGestureNav } from "../hooks/useGestureNav";
import type { Gesture } from "../metaWearables";
import type { VideoItem } from "../types/video";

export function ShortsPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shorts, setShorts] = useState<VideoItem[]>([]);
  const [cursor, setCursor] = useState("0");
  const [hasMore, setHasMore] = useState(true);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastGesture, setLastGesture] = useState<Gesture | null>(null);

  const loadMore = useCallback(async (next: string, reset: boolean) => {
    setLoading(true);
    const page = await loadFeed("shorts", next, "All");
    setShorts((prev) => (reset ? page.items : [...prev, ...page.items]));
    setCursor(page.nextCursor ?? "0");
    setHasMore(page.nextCursor != null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadMore("0", true);
  }, [loadMore]);

  useEffect(() => {
    const el = scrollRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  const openShort = useCallback(
    (index: number) => {
      const v = shorts[index];
      if (!v) return;
      navigate(`/watch/${v.id}`, {
        state: { video: v, queue: shorts, index, from: "shorts", isShort: true },
      });
    },
    [navigate, shorts],
  );

  const goNext = useCallback(() => {
    setActive((i) => {
      const next = Math.min(shorts.length - 1, i + 1);
      if (next >= shorts.length - 2 && hasMore && !loading) void loadMore(cursor, false);
      return next;
    });
  }, [cursor, hasMore, loadMore, loading, shorts.length]);

  const goPrev = useCallback(() => {
    setActive((i) => Math.max(0, i - 1));
  }, []);

  const handleGesture = useCallback(
    (type: Gesture) => {
      setLastGesture(type);

      if (type === "hold") {
        navigate("/");
        return;
      }

      if (type === "tap") {
        openShort(active);
        return;
      }

      if (type === "swipe_right") {
        navigate("/");
        return;
      }

      if (type === "swipe_left") return;

      if (type === "swipe_up") {
        goPrev();
        return;
      }

      if (type === "swipe_down") {
        goNext();
      }
    },
    [active, goNext, goPrev, navigate, openShort],
  );

  useGestureNav(handleGesture);

  return (
    <div className="page shorts-page">
      <header className="glass-bar glass-bar--compact">
        <h1>Shorts</h1>
        <p>Swipe ↓ next · ↑ prev · Tap play · → Home</p>
      </header>

      <div className="shorts-scroll" ref={scrollRef}>
        {shorts.map((video, i) => (
          <ShortCard
            key={`${video.id}-${i}`}
            video={video}
            active={i === active}
            onSelect={() => openShort(i)}
          />
        ))}
        {loading && <p className="shorts-loading">Loading…</p>}
      </div>

      <GestureHud hint="↓ next short · tap play · → home" last={lastGesture} />
    </div>
  );
}
