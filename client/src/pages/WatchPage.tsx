import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GestureHud } from "../components/GestureHud";
import { useGestureNav } from "../hooks/useGestureNav";
import type { Gesture } from "../metaWearables";
import type { VideoItem } from "../types/video";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (e: { target: YtPlayer }) => void;
            onError?: () => void;
          };
        },
      ) => YtPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YtPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  getPlayerState: () => number;
}

interface WatchState {
  video?: VideoItem;
  queue?: VideoItem[];
  index?: number;
  from?: "home" | "shorts";
  isShort?: boolean;
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as WatchState | null) ?? {};

  const queue = state.queue ?? (state.video ? [state.video] : []);
  const [index, setIndex] = useState(state.index ?? 0);
  const current = queue[index] ?? state.video;
  const id = videoId ?? current?.id ?? "";

  const [title, setTitle] = useState(current?.title ?? "YouTube");
  const [channel, setChannel] = useState(current?.channel ?? "");
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGesture, setLastGesture] = useState<Gesture | null>(null);

  const playerRef = useRef<YtPlayer | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const isShort = state.isShort ?? current?.kind === "short";

  const goBack = useCallback(() => {
    navigate(state.from === "shorts" ? "/shorts" : "/");
  }, [navigate, state.from]);

  const playIndex = useCallback(
    (i: number) => {
      const v = queue[i];
      if (!v) return;
      setIndex(i);
      setTitle(v.title);
      setChannel(v.channel);
      setError(null);
      setPlaying(false);
      if (playerRef.current) {
        playerRef.current.loadVideoById(v.id);
        playerRef.current.playVideo();
        setPlaying(true);
      }
    },
    [queue],
  );

  const nextVideo = useCallback(() => {
    if (index < queue.length - 1) {
      playIndex(index + 1);
      return;
    }
    setError("No more videos");
    window.setTimeout(() => setError(null), 1200);
  }, [index, playIndex, queue.length]);

  useEffect(() => {
    if (!id || !mountRef.current) return;
    let cancelled = false;

    const boot = async () => {
      await loadYouTubeApi();
      if (cancelled || !mountRef.current || !window.YT) return;

      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: id,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            setReady(true);
          },
          onError: () => {
            setError("Can't play — skipping…");
            window.setTimeout(() => nextVideo(), 900);
          },
        },
      });
    };

    void boot();
    return () => {
      cancelled = true;
      playerRef.current = null;
    };
  }, [id, nextVideo]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (p.getPlayerState() === 1) {
      p.pauseVideo();
      setPlaying(false);
    } else {
      p.playVideo();
      setPlaying(true);
    }
  }, []);

  const handleGesture = useCallback(
    (type: Gesture) => {
      setLastGesture(type);

      if (type === "hold" || type === "swipe_left") {
        goBack();
        return;
      }

      if (type === "tap") {
        togglePlay();
        return;
      }

      if (type === "swipe_down") {
        nextVideo();
        return;
      }

      if (type === "swipe_right") {
        goBack();
      }
    },
    [goBack, nextVideo, togglePlay],
  );

  useGestureNav(handleGesture);

  return (
    <div className={`page watch-page${isShort ? " watch-page--short" : ""}`}>
      <header className="glass-bar glass-bar--compact">
        <button type="button" className="back-btn" onClick={goBack}>
          ← Back
        </button>
        <div className="watch-meta">
          <strong>{title}</strong>
          {channel && <span>{channel}</span>}
        </div>
      </header>

      {error && <p className="toast-error">{error}</p>}

      <div className={`player-shell${isShort ? " player-shell--short" : ""}`}>
        <div ref={mountRef} className="yt-player" />
        {!ready && <div className="player-overlay">Loading…</div>}
        {ready && !playing && (
          <button type="button" className="player-overlay player-overlay--tap" onClick={togglePlay}>
            Tap to play
          </button>
        )}
      </div>

      <div className="watch-actions">
        <button type="button" className="action-btn" onClick={togglePlay}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" className="action-btn action-btn--ghost" onClick={nextVideo}>
          Next
        </button>
        <button type="button" className="action-btn action-btn--ghost" onClick={goBack}>
          Back
        </button>
      </div>

      <GestureHud hint="↓ next · tap play · hold back" last={lastGesture} />
    </div>
  );
}
