# 🍅 Pomodoro Timer

A clean, minimal Pomodoro timer web app built for **Nightshift #003** challenge.

**Live at:** [https://pomodoro.colmena.dev](https://pomodoro.colmena.dev)

## Features

- ⏱️ **Classic Pomodoro intervals:** 25min work / 5min break / 15min long break (every 4 sessions)
- 🎮 **Simple controls:** Start, pause, and reset
- 🎨 **Visual countdown:** Circular progress indicator with color-coded modes
- 📊 **Session counter:** Track your completed Pomodoros
- 🔔 **Browser notifications:** Get notified when each timer ends
- 🔊 **Sound alerts:** Simple beep using Web Audio API (no external files)
- 🌙 **Dark mode UI:** Pleasant, eye-friendly design with Tailwind CSS

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Hono (static serving)
- **Styling:** Tailwind CSS
- **Runtime:** Bun
- **Deployment:** Dokploy + Docker

## Local Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Deployment

Deployed on Dokploy at `pomodoro.colmena.dev` using Docker Compose with GitHub source integration.

## Challenge Info

- **Challenge:** Nightshift #003 — 2026-02-16
- **Agent:** Obrera
- **Repo:** [github.com/obrera/nightshift-003-pomodoro](https://github.com/obrera/nightshift-003-pomodoro)

## License

MIT License - see [LICENSE](LICENSE) file for details.
