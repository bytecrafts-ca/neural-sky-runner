import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { onGesture, type GestureEventDetail } from "./metaWearables";

type Lane = 0 | 1 | 2;
type Difficulty = "easy" | "normal" | "hard";
type Phase = "idle" | "countdown" | "playing" | "crashed";

interface Obstacle {
  id: number;
  lane: Lane;
  y: number;
  speed: number;
}

const LANES: Lane[] = [0, 1, 2];
const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];
const TICK_MS = 1000 / 60;
const PLAYER_TOP = 77;
const PLAYER_BOTTOM = 92;
const OBSTACLE_HEIGHT = 12;
const COUNTDOWN_STEPS = [3, 2, 1];

const DIFFICULTY_PRESETS: Record<
  Difficulty,
  { spawnMs: number; minSpawnMs: number; baseSpeed: number; ramp: number; scoreMult: number }
> = {
  easy: { spawnMs: 1180, minSpawnMs: 760, baseSpeed: 1.48, ramp: 0.0022, scoreMult: 1 },
  normal: { spawnMs: 960, minSpawnMs: 580, baseSpeed: 1.88, ramp: 0.003, scoreMult: 1.35 },
  hard: { spawnMs: 780, minSpawnMs: 440, baseSpeed: 2.28, ramp: 0.0038, scoreMult: 1.75 },
};

function overlapsPlayer(y: number) {
  const top = y;
  const bottom = y + OBSTACLE_HEIGHT;
  return top < PLAYER_BOTTOM && bottom > PLAYER_TOP;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function spawnInterval(score: number, settings: (typeof DIFFICULTY_PRESETS)[Difficulty]) {
  const onboard = score < 180 ? 1.18 : 1;
  const progress = easeOutCubic(Math.min(1, score / 720));
  const base = settings.spawnMs - (settings.spawnMs - settings.minSpawnMs) * progress;
  return Math.max(settings.minSpawnMs, base * onboard);
}

function obstacleSpeed(score: number, settings: (typeof DIFFICULTY_PRESETS)[Difficulty]) {
  const ramp = Math.min(5.2, score * settings.ramp);
  const tension = score > 400 ? Math.min(1.4, (score - 400) * 0.0012) : 0;
  return settings.baseSpeed + ramp + tension;
}

export function GamePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("sky-best") ?? 0));
  const [lane, setLane] = useState<Lane>(1);
  const [tick, setTick] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [modeLabel, setModeLabel] = useState<string | null>(null);

  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextId = useRef(1);
  const spawnAt = useRef(performance.now());
  const phaseRef = useRef<Phase>("idle");
  const laneRef = useRef<Lane>(1);
  const scoreRef = useRef(0);
  const settingsRef = useRef(DIFFICULTY_PRESETS.normal);

  const settings = DIFFICULTY_PRESETS[difficulty];
  settingsRef.current = settings;

  const running = phase === "playing";
  const over = phase === "crashed";
  const displayScore = Math.floor(score * settings.scoreMult);
  const laneStyle = useMemo(() => ({ left: `${lane * 33.333 + 16.6}%` }), [lane]);

  void tick;
  const obstacles = obstaclesRef.current;

  const beginCountdown = useCallback(() => {
    setPhase("countdown");
    phaseRef.current = "countdown";
    obstaclesRef.current = [];
    setScore(0);
    scoreRef.current = 0;
    setTick((n) => n + 1);
    spawnAt.current = performance.now() + 900;

    let step = 0;
    const run = () => {
      const n = COUNTDOWN_STEPS[step];
      if (n == null) {
        setCountdown(null);
        setPhase("playing");
        phaseRef.current = "playing";
        spawnAt.current = performance.now() + 400;
        return;
      }
      setCountdown(n);
      step += 1;
      window.setTimeout(run, 520);
    };
    run();
  }, []);

  const restart = useCallback(() => {
    setLane(1);
    laneRef.current = 1;
    beginCountdown();
  }, [beginCountdown]);

  const crash = useCallback(() => {
    setScore(scoreRef.current);
    setPhase("crashed");
    phaseRef.current = "crashed";

    const final = Math.floor(scoreRef.current * settingsRef.current.scoreMult);
    setBest((b) => {
      const next = Math.max(b, final);
      localStorage.setItem("sky-best", String(next));
      return next;
    });
  }, []);

  const cycleMode = useCallback((dir: 1 | -1 = 1) => {
    setDifficulty((current) => {
      const i = DIFFICULTIES.indexOf(current);
      const next = DIFFICULTIES[(i + dir + DIFFICULTIES.length) % DIFFICULTIES.length];
      setModeLabel(next);
      window.setTimeout(() => setModeLabel(null), 900);
      return next;
    });
  }, []);

  const moveLane = useCallback((dir: -1 | 1) => {
    setLane((l) => {
      const next = Math.min(2, Math.max(0, l + dir)) as Lane;
      laneRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    laneRef.current = lane;
  }, [lane]);

  useEffect(() => {
    const stop = onGesture((g: GestureEventDetail) => {
      if (g.type === "tap") {
        if (phaseRef.current === "crashed") {
          restart();
          return;
        }
        if (phaseRef.current === "idle") {
          restart();
          return;
        }
        if (phaseRef.current === "countdown") return;
        if (phaseRef.current === "playing") {
          setPhase("idle");
          phaseRef.current = "idle";
        }
        return;
      }

      if (g.type === "hold") {
        if (phaseRef.current === "crashed") {
          restart();
          return;
        }
        if (phaseRef.current === "idle" || phaseRef.current === "countdown") {
          cycleMode(1);
        }
        return;
      }

      if (phaseRef.current === "idle" || phaseRef.current === "countdown") {
        if (g.type === "swipe_up") cycleMode(-1);
        if (g.type === "swipe_down") cycleMode(1);
        return;
      }

      if (phaseRef.current !== "playing") return;

      if (g.type === "swipe_left") moveLane(-1);
      if (g.type === "swipe_right") moveLane(1);
    });

    return () => stop();
  }, [cycleMode, moveLane, restart]);

  useEffect(() => {
    if (phase !== "playing") return;

    let raf = 0;
    let last = performance.now();
    let scoreFrames = 0;

    const loop = (now: number) => {
      if (phaseRef.current !== "playing") return;

      if (now - last >= TICK_MS) {
        last = now;
        scoreRef.current += 1;
        scoreFrames += 1;

        const cfg = settingsRef.current;
        const s = scoreRef.current;

        if (now >= spawnAt.current) {
          spawnAt.current = now + spawnInterval(s, cfg);
          obstaclesRef.current.push({
            id: nextId.current++,
            lane: LANES[Math.floor(Math.random() * LANES.length)],
            y: -8,
            speed: obstacleSpeed(s, cfg),
          });
        }

        const playerLane = laneRef.current;
        let collision = false;

        for (const o of obstaclesRef.current) {
          const yPrev = o.y;
          o.y += o.speed;
          if (o.lane === playerLane) {
            const hitNow = overlapsPlayer(o.y);
            const crossedZone = yPrev < PLAYER_TOP && o.y + OBSTACLE_HEIGHT > PLAYER_BOTTOM;
            if (hitNow || crossedZone) collision = true;
          }
        }

        obstaclesRef.current = obstaclesRef.current.filter((o) => o.y <= 112);

        if (scoreFrames >= 6) {
          scoreFrames = 0;
          setScore(s);
        }
        setTick((n) => n + 1);

        if (collision) crash();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, crash]);

  const arenaClass = ["glass-card", "arena", running ? "arena--running" : "", over ? "arena--crash" : ""]
    .filter(Boolean)
    .join(" ");

  const speedFactor = Math.min(1.8, 1 + score / 600);

  return (
    <main className="game-shell">
      <section className="glass-card hud">
        <div className="hud-main">
          <h1>Neural Sky Runner</h1>
          <p className="hud-hint">Swipe · Tap · Hold</p>
        </div>
        <div className="score-wrap" aria-live="polite">
          <span className="score-primary">{displayScore}</span>
          <span className="score-meta">
            Best {best} · {difficulty}
          </span>
        </div>
      </section>

      <section className={arenaClass} style={{ ["--speed" as string]: String(speedFactor) }}>
        <div className="depth-glow depth-glow--one" />
        <div className="depth-glow depth-glow--two" />
        <div className="depth-fog" />
        <div className="lane-lines" />
        <div className="road-flow" />
        <div className="speed-lines" />

        {obstacles.map((o) => (
          <div
            key={o.id}
            className="obstacle"
            style={{ left: `${o.lane * 33.333 + 16.6}%`, top: `${o.y}%` }}
          />
        ))}

        <div className="player" style={laneStyle}>
          <span className="player-core" />
        </div>

        {modeLabel && <div className="mode-toast">{modeLabel}</div>}

        {countdown != null && (
          <div className="countdown-ring" aria-hidden>
            {countdown}
          </div>
        )}

        {phase === "idle" && (
          <div className="overlay overlay--start">
            <div>
              <strong>Tap to run</strong>
              <p>{difficulty} · Swipe ↑↓ mode · Hold cycles</p>
            </div>
          </div>
        )}

        {over && (
          <div className="overlay overlay--crash">
            <div>
              <strong>Crashed</strong>
              <p>{displayScore} pts · Tap restart</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
