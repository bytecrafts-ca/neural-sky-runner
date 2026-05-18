import type { Gesture } from "../metaWearables";

const LABELS: Record<Gesture, string> = {
  tap: "Tap",
  hold: "Hold",
  swipe_left: "←",
  swipe_right: "→",
  swipe_up: "↑",
  swipe_down: "↓",
};

export function GestureHud({ hint, last }: { hint: string; last: Gesture | null }) {
  return (
    <footer className="gesture-hud" aria-live="polite">
      <span className="gesture-hud__hint">{hint}</span>
      {last && <span className="gesture-hud__last">{LABELS[last]}</span>}
    </footer>
  );
}
