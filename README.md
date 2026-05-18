# YouTube Lens

YouTube-style browser for **Meta Ray-Ban Display** with **Neural Band** gestures.

## Glasses URL (use this)

```bash
npm install
npm run tunnel
```

Paste the `https://….trycloudflare.com` URL into the Meta AI app.

## Features

- **Home** — vertical feed, infinite scroll, category filters
- **Shorts** — full-screen snap scroll (swipe ↓ next, ↑ prev)
- **Watch** — YouTube player, tap play, swipe ↓ next video
- **Liquid glass** UI tuned for the display
- Works **without** a YouTube API key (built-in catalog + server pagination)

## Gestures

| Gesture | Home | Shorts | Watch |
|---------|------|--------|-------|
| ↓ / ↑ | Scroll feed | Next / prev Short | Next video |
| ← | Open Shorts tab | — | Back |
| Tap | Open video | Play | Play / pause |
| Hold | — | Back home | Back |

## GitHub Pages

https://bytecrafts-ca.github.io/neural-sky-runner/

Browse works offline from catalog; for full player + API use `npm run tunnel`.

## Push to deploy

```bash
git push origin main
```
