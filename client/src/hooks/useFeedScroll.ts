import { useCallback, useRef, type RefObject } from "react";

export function useFeedScroll(containerRef: RefObject<HTMLElement | null>) {
  const lastDir = useRef<"up" | "down" | null>(null);
  const lastAt = useRef(0);

  const scrollByGesture = useCallback(
    (direction: "up" | "down") => {
      const el = containerRef.current;
      if (!el) return;

      const now = Date.now();
      const chained = lastDir.current === direction && now - lastAt.current < 400;
      lastDir.current = direction;
      lastAt.current = now;

      const amount = chained ? window.innerHeight * 0.55 : window.innerHeight * 0.72;
      el.scrollBy({ top: direction === "down" ? amount : -amount, behavior: "smooth" });
    },
    [containerRef],
  );

  return { scrollByGesture };
}
