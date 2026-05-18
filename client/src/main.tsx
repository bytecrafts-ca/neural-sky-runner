import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { initGestureSystem } from "./metaWearables";
import "./app.css";

initGestureSystem();

const base = import.meta.env.BASE_URL;
const basename = base === "/" ? undefined : base.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
