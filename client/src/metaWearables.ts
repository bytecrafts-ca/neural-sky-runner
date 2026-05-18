export type Gesture = "tap" | "hold" | "swipe_left" | "swipe_right" | "swipe_up" | "swipe_down";

type GestureSource = "meta" | "touch" | "keyboard";

export interface GestureEventDetail {
  type: Gesture;
  source: GestureSource;
  timestamp: number;
}

const EVENT_NAME = "neural-gesture";

const COOLDOWN: Record<Gesture, number> = {
  tap: 200,
  hold: 360,
  swipe_left: 90,
  swipe_right: 90,
  swipe_up: 110,
  swipe_down: 110,
};

const lastByType: Partial<Record<Gesture, number>> = {};
let lastAny = 0;
let lastVerticalAt = 0;
let verticalChain = 0;

function isVertical(type: Gesture) {
  return type === "swipe_up" || type === "swipe_down";
}

function canEmit(type: Gesture): boolean {
  const now = Date.now();
  const cooldown = COOLDOWN[type];
  const lastType = lastByType[type] ?? 0;

  if (now - lastType < cooldown) {
    if (isVertical(type) && lastByType[type] && now - lastType < cooldown * 0.5) return false;
    if (!isVertical(type)) return false;
  }

  if (isVertical(type)) {
    if (now - lastVerticalAt < 280) verticalChain += 1;
    else verticalChain = 1;
    lastVerticalAt = now;
    return true;
  }

  if (now - lastVerticalAt < 180 && verticalChain > 0 && (type === "tap" || type === "hold")) {
    return false;
  }

  if (now - lastAny < 40 && (type === "tap" || type === "hold")) return false;
  return true;
}

function emit(type: Gesture, source: GestureSource) {
  if (!canEmit(type)) return;
  const now = Date.now();
  lastByType[type] = now;
  lastAny = now;

  window.dispatchEvent(
    new CustomEvent<GestureEventDetail>(EVENT_NAME, {
      detail: { type, source, timestamp: now },
    }),
  );
}

export function onGesture(handler: (detail: GestureEventDetail) => void): () => void {
  const listener = (e: Event) => {
    handler((e as CustomEvent<GestureEventDetail>).detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

function installKeyboardFallback() {
  window.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === "ArrowLeft" || e.key === "a") emit("swipe_left", "keyboard");
    if (e.key === "ArrowRight" || e.key === "d") emit("swipe_right", "keyboard");
    if (e.key === "ArrowUp" || e.key === "w") emit("swipe_up", "keyboard");
    if (e.key === "ArrowDown" || e.key === "s") emit("swipe_down", "keyboard");
    if (e.key === " " || e.key === "Enter") emit("tap", "keyboard");
    if (e.key === "Backspace") emit("hold", "keyboard");
  });
}

function installTouchFallback() {
  let startX = 0;
  let startY = 0;
  let downAt = 0;
  let activeId: number | null = null;

  const reset = () => {
    activeId = null;
  };

  window.addEventListener(
    "touchstart",
    (e) => {
      if (activeId != null) return;
      const t = e.changedTouches[0];
      if (!t) return;
      activeId = t.identifier;
      startX = t.clientX;
      startY = t.clientY;
      downAt = Date.now();
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    (e) => {
      const t = [...e.changedTouches].find((touch) => touch.identifier === activeId) ?? e.changedTouches[0];
      if (!t) return;
      reset();

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dist = Math.hypot(dx, dy);
      const dt = Date.now() - downAt;

      if (dist < 22) {
        emit(dt > 420 ? "hold" : "tap", "touch");
        return;
      }

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < 24 && absY < 24) return;

      if (absX >= absY * 1.1) {
        emit(dx > 0 ? "swipe_right" : "swipe_left", "touch");
      } else if (absY >= absX * 1.1) {
        emit(dy > 0 ? "swipe_down" : "swipe_up", "touch");
      }
    },
    { passive: true },
  );

  window.addEventListener("touchcancel", reset, { passive: true });
}

function installMetaBridge() {
  const map = new Map<string, Gesture>([
    ["TAP", "tap"],
    ["DOUBLE_TAP", "tap"],
    ["SELECT", "tap"],
    ["HOLD", "hold"],
    ["LONG_PRESS", "hold"],
    ["BACK", "hold"],
    ["SWIPE_LEFT", "swipe_left"],
    ["SWIPE_RIGHT", "swipe_right"],
    ["SWIPE_UP", "swipe_up"],
    ["SWIPE_DOWN", "swipe_down"],
    ["LEFT", "swipe_left"],
    ["RIGHT", "swipe_right"],
    ["UP", "swipe_up"],
    ["DOWN", "swipe_down"],
  ]);

  const parseAndEmit = (payload: unknown, depth = 0) => {
    if (!payload || typeof payload !== "object" || depth > 4) return;
    const obj = payload as Record<string, unknown>;
    const raw = String(obj.gesture ?? obj.action ?? obj.type ?? "").toUpperCase();
    const mapped = map.get(raw);
    if (mapped) emit(mapped, "meta");
    if (obj.detail && typeof obj.detail === "object") parseAndEmit(obj.detail, depth + 1);
    if (obj.payload && typeof obj.payload === "object") parseAndEmit(obj.payload, depth + 1);
  };

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (typeof data === "string") {
      try {
        parseAndEmit(JSON.parse(data));
      } catch {
        return;
      }
      return;
    }
    parseAndEmit(data);
  });

  window.parent?.postMessage({ source: "youtube-lens", type: "REQUEST_GESTURE_STREAM" }, "*");
}

export function initGestureSystem() {
  installKeyboardFallback();
  installTouchFallback();
  installMetaBridge();
}
