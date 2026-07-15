# Web Game 03

A multiplayer real-time reaction test game, featuring a neo-brutalism lobby UI and an ultra-precise Reaction Time test styled like the Human Benchmark.

## Architecture

This project is a monorepo containing both the React frontend and Node.js backend.
We use **Geckos.io** (UDP WebRTC data channels) for ultra-low latency multiplayer communication instead of Socket.io.

### Tech Stack
- **Frontend (client/):** React + Vite, Lucide React (UI Icons)
- **Backend (server/):** Node.js, Express, Geckos.io
- **Orchestration:** Concurrently (run both client and server simultaneously)

## Getting Started

1. Install dependencies from the root directory:
   ```bash
   npm install
   ```
   *Note: This will automatically install dependencies in both the `client/` and `server/` folders.*

2. Start both the Vite frontend and Geckos.io backend simultaneously:
   ```bash
   npm run dev
   ```

3. Open your browser to the local Vite URL (e.g. `http://localhost:5173`).

## Game Flow

1. **Host a Game:** Create a lobby and get a 4-letter room code.
2. **Join a Game:** Friends can join the room using your code.
3. **Start:** Once the host clicks Start Game, players enter the independent Reaction Test.
4. **Independent Rounds:** Every player must complete 5 rounds of the reaction test at their own pace.
5. **Leaderboard:** Once everyone finishes, the server gathers the absolute **best** reaction time for each player and ranks them on the leaderboard.
