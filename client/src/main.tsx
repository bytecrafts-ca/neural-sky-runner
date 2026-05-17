import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initGestureSystem } from "./metaWearables";

initGestureSystem();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
