import { useEffect } from "react";
import { onGesture, type Gesture, type GestureEventDetail } from "../metaWearables";

export function useGestureNav(handler: (type: Gesture) => void) {
  useEffect(() => {
    const stop = onGesture((g: GestureEventDetail) => handler(g.type));
    return stop;
  }, [handler]);
}
