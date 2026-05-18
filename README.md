# YouTube Lens

YouTube browser for **Meta Ray-Ban Display** with **Neural Band** gestures.

## Glasses URL (recommended)

Run the server + HTTPS tunnel — the API proxy is required for search/browse:

```bash
npm install
npm run tunnel
```

Paste the `https://….trycloudflare.com` URL into the Meta AI app.

## Gestures

| Gesture | Browse | Watch |
|---------|--------|-------|
| Swipe ←/→ | Move focus | Back |
| Swipe ↑/↓ | Move focus (rows) | — |
| Tap | Open video | Play / pause |
| Hold | — | Back |

On-screen **Play** and **Back** buttons are fallbacks if gestures miss.

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:5173 (API proxied to :3001).

## Optional: YouTube Data API

Set `YOUTUBE_API_KEY` when starting the server for more reliable search/trending. Without it, Invidious public instances are used as fallback.

## GitHub Pages

Static deploy at https://bytecrafts-ca.github.io/neural-sky-runner/ only serves the UI — **search needs the server**. Use `npm run tunnel` for full glasses testing.

Push to `main` to redeploy Pages.
