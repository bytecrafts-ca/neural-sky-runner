import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { VideoItem } from "../api/youtube";
import { GestureHud } from "../components/GestureHud";
import { useGestureNav } from "../hooks/useGestureNav";
import type { Gesture } from "../metaWearables";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: { onReady?: (e: { target: YtPlayer }) => void };
        },
      ) => YtPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YtPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
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
  const stateVideo = (location.state as { video?: VideoItem } | null)?.video;

  const [title, setTitle] = useState(stateVideo?.title ?? "YouTube");
  const [channel, setChannel] = useState(stateVideo?.channel ?? "");
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [lastGesture, setLastGesture] = useState<Gesture | null>(null);

  const playerRef = useRef<YtPlayer | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoId || !mountRef.current) return;
    let cancelled = false;

    const boot = async () => {
      await loadYouTubeApi();
      if (cancelled || !mountRef.current || !window.YT) return;

      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            setReady(true);
          },
        },
      });
    };

    void boot();
    return () => {
      cancelled = true;
      playerRef.current = null;
    };
  }, [videoId]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const state = p.getPlayerState();
    if (state === 1) {
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

      if (type === "hold") {
        navigate(-1);
        return;
      }

      if (type === "tap") {
        togglePlay();
        return;
      }

      if (type === "swipe_left") navigate(-1);
    },
    [navigate, togglePlay],
  );

  useGestureNav(handleGesture);

  return (
    <div className="page watch-page">
      <header className="glass-bar glass-bar--compact">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="watch-meta">
          <strong>{title}</strong>
          {channel && <span>{channel}</span>}
        </div>
      </header>

      <div className="player-shell">
        <div ref={mountRef} className="yt-player" />
        {!ready && <div className="player-overlay">Loading player…</div>}
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
        <button type="button" className="action-btn action-btn--ghost" onClick={() => navigate(-1)}>
          Home
        </button>
      </div>

      <GestureHud last={lastGesture} />
    </div>
  );
}
