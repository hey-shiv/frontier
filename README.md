# Frontier

AI project recommendation engine for researchers, engineers, and builders. Generates personalized, scored project ideas across AI domains using a two-stage LLM pipeline.

## What it does

1. **Stage 1 — Fast Preview** (~8s): Generates 6 project previews (title, pitch, scores, tags) based on your domains, interests, experience, and goal.
2. **Stage 2 — Deep Dive** (on-demand): Expands any preview into a full project spec — architecture, roadmap, datasets, APIs, evaluation metrics, deployment strategy, research directions.
3. **Save & Library**: Bookmark projects to your session-scoped library. Revisit and delete from the Saved page.

## Stack

| Layer | Tech |
|---|---|
| Web frontend | React + Vite + TanStack Query |
| API | Hono on Bun |
| LLM | OpenRouter (configurable model) |
| Database | SQLite via Bun's native `bun:sqlite` |
| Desktop | Electron (uses web dist) |
| Mobile | Expo (React Native) |

## Project structure

```
frontier/
├── packages/
│   ├── web/              # Hono API + React web app (monolith)
│   │   ├── src/
│   │   │   ├── api/      # Route handlers, Zod schemas
│   │   │   ├── shared/   # Canonical TypeScript types
│   │   │   └── web/      # React pages, components, lib
│   │   └── ...
│   ├── mobile/           # Expo app
│   └── desktop/          # Electron shell
└── ...
```

## Getting started

### Prerequisites
- [Bun](https://bun.sh) ≥ 1.1
- An [OpenRouter](https://openrouter.ai) API key

### Setup

```bash
git clone <repo>
cd frontier
bun install
```

Create `packages/web/.env`:

```env
OPENROUTER_API_KEY=sk-or-...
# Optional — defaults to meta-llama/llama-3.1-8b-instruct:free
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

### Run

```bash
# Web (dev)
cd packages/web
bun run dev

# Desktop
cd packages/desktop
bun run dev

# Mobile
cd packages/mobile
bun run start
```

### Test

```bash
cd packages/web
bun test
```

### Type check

```bash
cd packages/web
bun run typecheck
```

## API routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/generate/previews` | Stage 1 — generate 6 previews |
| `POST` | `/api/generate/detail` | Stage 2 — deep dive on a preview |
| `POST` | `/api/projects/save` | Save project to session library |
| `GET` | `/api/projects/saved` | Fetch saved projects for session |
| `DELETE` | `/api/projects/saved/:id` | Delete a saved project (session-scoped) |

All routes accept/return JSON. Session identity is passed via the `x-session-id` header (auto-generated client-side, stored in `localStorage`).

## Security notes

- **No API key logging** — `OPENROUTER_API_KEY` is never logged or exposed to the client.
- **Session-scoped deletes** — delete endpoint validates that the project belongs to the requesting session.
- **Duplicate prevention** — saving the same title twice within a session returns `409 Conflict`.
- **Electron IPC path guard** — `fs:read` and `fs:write` are restricted to the user's home directory and app userData. Paths with `..` or null bytes are rejected.
- **Input validation** — all API routes validate request bodies with Zod schemas before processing.

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENROUTER_API_KEY` | Yes | — | OpenRouter API key |
| `OPENROUTER_MODEL` | No | `meta-llama/llama-3.1-8b-instruct:free` | Model used for generation |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | `production` enables optimizations |

## License

MIT
