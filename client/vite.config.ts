import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: "0.0.0.0", port: 5173 },
  build: { outDir: "dist" },
});
