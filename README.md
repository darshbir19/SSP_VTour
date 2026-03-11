# FeelSSP — Sham Shui Po Sensory Tour

An immersive 360° visual and spatial-audio virtual tour of **Sham Shui Po (深水埗)**, Hong Kong — the raw, vibrant, nostalgic heart of Kowloon.

Built with React + Vite + TypeScript + Tailwind CSS + Three.js + @react-three/fiber.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

## Production build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Deploy to Vercel

1. Push the repo to GitHub / GitLab.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
4. Every push to `main` auto-deploys.

---

## How to add your own 360° photos and audio

All content is data-driven from a single file:

```
src/data/nodes.ts
```

### Adding a panorama

1. Take or download an **equirectangular** 360° photo (JPEG recommended, 4096×2048 px for good quality).
2. Place it in `public/panoramas/` (e.g. `public/panoramas/apliu-day.jpg`).
3. Set the node's `panoramaUrl` to `"/panoramas/apliu-day.jpg"`.

> **Tip:** You can also use remote URLs from 360cities.net or your own CDN.

### Adding audio

1. Use MP3 or OGG files. Keep ambient loops under 2 MB for fast loading.
2. Place them in `public/audio/` (e.g. `public/audio/apliu-ambient.mp3`).
3. Set the node's `ambientLoopUrl` and each `audioSources[].url` accordingly.

**Suggested free sound sources:**
- [Bandcamp — Market Sounds Hong Kong Sham Shui Po](https://freetousesounds.bandcamp.com/album/market-sounds-hong-kong-sham-shui-po-market-ambience)
- [Freesound.org](https://freesound.org) — search "hong kong market", "street vendor", "cantonese"

### Adding a new node

Copy an existing entry in the `nodes` array in `src/data/nodes.ts` and change:
- `id` — unique string
- `nameEn` / `nameZh` — bilingual name
- `descriptionEn` / `descriptionZh` — short bilingual blurb
- `panoramaUrl` — your 360° image
- `thumbnailUrl` — small preview for the bottom nav
- `ambientLoopUrl` — background audio loop
- `audioSources` — array of positional 3D sounds (with `[x, y, z]` positions)
- `hotspots` — array of portals to other nodes
- `infoEn` / `infoZh` — optional fun-fact text

---

## Tech stack

| Layer | Library |
|-------|---------|
| UI framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS 3 |
| 3D rendering | Three.js + @react-three/fiber + @react-three/drei |
| Spatial audio | Three.js AudioListener + PositionalAudio |
| WebXR / VR | @react-three/xr + manual WebXR session API |

## Project structure

```
src/
├── audio/           # AudioManager + audio loading hook
├── components/      # React UI (Hero, InfoPanel, TopBar, BottomNav, …)
│   └── layout/      # TopBar, BottomNav
├── context/         # ExperienceContext (global state)
├── data/            # nodes.ts — all tour content lives here
├── three/           # 3D scene, first-person controls, WebXR button
│   └── hooks/       # useFirstPersonControls
├── types/           # TypeScript interfaces
├── utils/           # device detection, fullscreen helpers
├── App.tsx          # Root component
├── main.tsx         # Vite entry point
└── style.css        # Tailwind layers + neon utilities
```

## Performance tips

- Compress panorama images with [Squoosh](https://squoosh.app/) or `cjpeg` — aim for < 1 MB each.
- Use OGG for audio when possible (smaller than MP3 at similar quality).
- The app lazy-loads the 3D scene and audio; the hero page loads instantly.

## License

MIT — do whatever you want with it.
