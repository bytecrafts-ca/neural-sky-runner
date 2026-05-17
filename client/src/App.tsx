import { useEffect } from "react";
import { GamePage } from "./GamePage";
import { onGesture } from "./metaWearables";
import "./app.css";

export default function App() {
  useEffect(() => {
    return onGesture((gesture) => {
      // keep page scroll disabled and game-focused
      if (gesture.type === "swipe_up" || gesture.type === "swipe_down") {
        window.scrollTo({ top: 0 });
      }
    });
  }, []);

  return <GamePage />;
}
