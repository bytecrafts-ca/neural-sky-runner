import type { Gesture } from "../metaWearables";

const LABELS: Record<Gesture, string> = {
  tap: "Tap · select / play",
  hold: "Hold · back",
  swipe_left: "← previous",
  swipe_right: "→ next",
  swipe_up: "↑ up",
  swipe_down: "↓ down",
};

export function GestureHud({ last }: { last: Gesture | null }) {
  return (
    <footer className="gesture-hud" aria-live="polite">
      <span>{last ? LABELS[last] : "Swipe · Tap · Hold"}</span>
    </footer>
  );
}
