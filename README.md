# Local Network Remote Control — Phase 1 MVP

Control your computer from any phone or browser on the same Wi-Fi network.

```
Phone/Browser (Remote UI)  ──WebSocket──►  Node Server  ──►  System (robotjs / child_process)
```

---

## Project Structure

```
Private-cloud-/
├── frontend/               # React + TypeScript + Vite + TailwindCSS
│   └── src/
│       ├── components/     # ConnectionStatus, Touchpad, MouseButtons, MediaControls, SystemActions
│       ├── hooks/          # useSocket (connection lifecycle)
│       ├── pages/          # RemoteControl (main page)
│       └── socket/         # socketClient (token fetch + socket.io init)
└── backend/                # Node.js + Express + Socket.IO
    └── src/
        ├── commands/       # mouseCommands, mediaCommands, systemCommands
        ├── server.ts       # HTTP server, IP filtering, token endpoint
        └── socketHandlers.ts
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18 |
| npm | >= 9 |

> **robotjs** requires native build tools.
> - **Linux**: `sudo apt install build-essential libxtst-dev libpng++-dev`
> - **macOS**: Xcode Command Line Tools + grant Accessibility permission
> - **Windows**: `npm install --global windows-build-tools` (run as admin)

---

## Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## Running Locally

### 1. Start the backend (on the computer you want to control)
```bash
cd backend
npm run dev
# Server starts on http://0.0.0.0:3001
```

### 2. Start the frontend dev server
```bash
cd frontend
npm run dev
# Vite serves on http://0.0.0.0:5173
```

### 3. Open on your phone

Find your computer's local IP:
```bash
# Linux/macOS
ip route get 1 | awk '{print $7; exit}'
# or
hostname -I | awk '{print $1}'
```

Navigate to `http://<your-computer-ip>:5173` on your phone's browser.

---

## Security (Phase 1)

| Measure | Detail |
|---------|--------|
| IP Allowlist | Only `127.x`, `192.168.x`, `10.x`, `172.16-31.x` can connect |
| Session Token | Backend generates a 48-char hex token; frontend fetches it and sends it on every socket connection |
| Token validation | Socket.IO middleware rejects connections with missing/unknown tokens |

---

## Socket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `mouse-move` | client -> server | `{ dx: number, dy: number }` |
| `left-click` | client -> server | — |
| `right-click` | client -> server | — |
| `volume-up` | client -> server | — |
| `volume-down` | client -> server | — |
| `play-pause` | client -> server | — |
| `open-chrome` | client -> server | — |
| `lock-screen` | client -> server | — |
| `shutdown` | client -> server | — |

---

## Production Build

```bash
# Frontend
cd frontend && npm run build   # outputs to frontend/dist/

# Backend
cd backend && npm run build    # outputs to backend/dist/
node backend/dist/server.js
```

To serve the frontend bundle from Express, copy `frontend/dist/` to `backend/public/` and add:
```ts
app.use(express.static(path.join(__dirname, '../public')));
```
