<div align="center">

<br />

```
███████╗██████╗  ██████╗ ███╗   ██╗████████╗██╗███████╗██████╗
██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██║██╔════╝██╔══██╗
█████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   ██║█████╗  ██████╔╝
██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██║██╔══╝  ██╔══██╗
██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ██║███████╗██║  ██║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝╚══════╝╚═╝  ╚═╝
```

<br />

**An AI project recommendation engine for researchers, engineers, and builders.**

*From intent to specification — in seconds.*

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)
[![Bun](https://img.shields.io/badge/runtime-Bun-black?style=flat-square&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-black?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

<br />

</div>

---

<br />

## Why Frontier

Most people don't lack intelligence — they lack direction.

Frontier takes your domains, interests, and goals, then generates deeply personalized AI project ideas using a multi-stage LLM pipeline. Not generic suggestions. Not templated output. Precise, scored, expandable project blueprints — with architecture, datasets, evaluation metrics, and roadmaps — ready to build.

It's the tool you'd wish existed when staring at a blank page.

<br />

---

<br />

## Pipeline

Frontier's generation flow is a deliberate two-stage design.

```
  User Input
      │
      ▼
┌─────────────────────────────────┐
│  Stage 1 · Fast Preview         │  ~8s
│                                 │
│  Gemini → Groq → OpenRouter     │
│  → local fallback               │
│                                 │
│  Returns 6 scored previews      │
│  title · pitch · tags · score   │
└───────────────┬─────────────────┘
                │  (on demand)
                ▼
┌─────────────────────────────────┐
│  Stage 2 · Deep Specification   │
│                                 │
│  Full project expansion:        │
│  architecture · datasets        │
│  roadmap · APIs · deployment    │
│  evaluation · research paths    │
└─────────────────────────────────┘
                │
                ▼
         Save to Library
```

**Provider chain** — `Gemini → Groq → OpenRouter → local-fallback`
Each provider is tried sequentially. The response always tells you which provider served it.

<br />

---

<br />

## Features

<br />

| | Feature | Detail |
|---|---|---|
| ⚡ | **Fast Previews** | 6 project ideas in ~8s, scored and tagged |
| 🔬 | **Deep Specification** | Full project expansion on demand — architecture, roadmap, datasets, APIs |
| 🔗 | **Multi-Provider Chain** | Gemini → Groq → OpenRouter → local fallback. Zero single point of failure |
| 💾 | **Session Library** | Save and revisit projects across sessions |
| 🖥 | **Desktop App** | Electron shell — same codebase, native feel |
| 📱 | **Mobile** | Expo React Native — iOS and Android |
| 🛡 | **Secure by Design** | No key leakage, session-scoped deletes, Zod-validated inputs |

<br />

---

<br />

## Stack

<br />

```
Web Frontend   →   React · Vite · TanStack Query
API Server     →   Hono on Bun
LLM Providers  →   Gemini · Groq · OpenRouter (sequential chain)
Database       →   SQLite via bun:sqlite (zero dependencies)
Desktop        →   Electron
Mobile         →   Expo · React Native
Language       →   TypeScript (strict)
```

<br />

---

<br />

## System Design

<br />

```
frontier/
├── packages/
│   ├── web/                      # Core — Hono API + React frontend
│   │   └── src/
│   │       ├── api/
│   │       │   ├── data/
│   │       │   │   ├── llmChain.ts        # Provider orchestration
│   │       │   │   ├── gemini.ts          # Gemini provider
│   │       │   │   ├── groq.ts            # Groq provider
│   │       │   │   ├── openrouter.ts      # OpenRouter provider
│   │       │   │   ├── promptBuilder.ts   # Shared prompt construction
│   │       │   │   ├── enrichment.ts      # Context enrichment
│   │       │   │   └── mockGenerator.ts   # Dynamic local fallback
│   │       │   ├── schemas.ts             # Zod request validation
│   │       │   └── index.ts               # Route handlers
│   │       ├── shared/
│   │       │   └── types.ts               # Canonical TypeScript types
│   │       └── web/                       # React pages + components
│   ├── mobile/                   # Expo app
│   └── desktop/                  # Electron shell
```

<br />

---

<br />

## Quickstart

**Prerequisites:** [Bun](https://bun.sh) ≥ 1.1 and at least one LLM API key.

<br />

**1. Clone and install**

```bash
git clone https://github.com/hey-shiv/frontier.git
cd frontier
bun install
```

<br />

**2. Configure environment**

Create `.env` at the repo root:

```env
# Required — at least one provider key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=sk-or-...

# Optional
PORT=3000
NODE_ENV=development
```

The provider chain falls back gracefully — if `GEMINI_API_KEY` is absent, it tries Groq, then OpenRouter, then generates locally.

<br />

**3. Run**

```bash
# Web (dev server)
cd packages/web && bun run dev

# Desktop
cd packages/desktop && bun run dev

# Mobile
cd packages/mobile && bun run start
```

<br />

---

<br />

## API

All routes accept and return JSON. Session identity is passed via the `x-session-id` header — generated client-side and stored in `localStorage`.

<br />

| Method | Route | Description |
|:---:|---|---|
| `POST` | `/api/generate/previews` | Stage 1 — generate 6 scored project previews |
| `POST` | `/api/generate/detail` | Stage 2 — expand a preview into a full specification |
| `POST` | `/api/projects/save` | Save a project to the session library |
| `GET` | `/api/projects/saved` | Fetch all saved projects for the current session |
| `DELETE` | `/api/projects/saved/:id` | Delete a saved project (session-scoped) |

<br />

<details>
<summary><strong>POST /api/generate/previews — request shape</strong></summary>

<br />

```typescript
{
  domains: string[]         // e.g. ["NLP", "Computer Vision"]
  interests?: string[]      // e.g. ["transformers", "edge inference"]
  companies?: string[]      // e.g. ["Google", "Mistral"]
  experience: string        // "Beginner" | "Intermediate" | "Advanced"
  goal: string              // "Startup" | "Research" | "Learning" | "Portfolio"
  timeCommitment: string    // "1 week" | "1 month" | "3 months" | "6 months+"
  seed?: number
}
```

</details>

<details>
<summary><strong>Response — meta field</strong></summary>

<br />

```typescript
{
  previews: ProjectPreview[]
  meta: {
    provider: "gemini" | "groq" | "openrouter" | "local-fallback"
    model?: string
    generatedAt?: string
    warning?: string
  }
}
```

</details>

<br />

---

<br />

## Environment Variables

<br />

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `GEMINI_API_KEY` | — | — | Google Gemini API key |
| `GROQ_API_KEY` | — | — | Groq API key |
| `OPENROUTER_API_KEY` | — | — | OpenRouter API key |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Enables production optimizations |

At least one provider key is recommended. All three absent → local fallback mode.

<br />

---

<br />

## Security

- **No key exposure** — provider keys never logged, never sent to client
- **Session-scoped deletes** — ownership validated before deletion
- **Duplicate prevention** — saving the same title twice returns `409`
- **Input validation** — all routes validated with Zod before processing
- **Electron path guard** — `fs:read` / `fs:write` restricted to home + userData; `..` and null bytes rejected

<br />

---

<br />

## Developer Experience

```bash
# Type check
cd packages/web && bun run typecheck

# Test
cd packages/web && bun test

# All tests pass, zero TypeScript errors
```

<br />

---

<br />

## Roadmap

<br />

| Status | Item |
|:---:|---|
| ✅ | Multi-provider LLM chain (Gemini → Groq → OpenRouter → local) |
| ✅ | Two-stage generation pipeline |
| ✅ | Session-scoped project library |
| ✅ | Electron desktop app |
| ✅ | Expo mobile app |
| 🔲 | Authentication + persistent user accounts |
| 🔲 | Project export (PDF / Markdown) |
| 🔲 | Collaborative workspaces |
| 🔲 | Fine-tuned domain models |
| 🔲 | Project similarity search |
| 🔲 | GitHub integration — scaffold project from spec |

<br />

---

<br />

## Philosophy

**Minimal surface, maximum depth.**
Frontier doesn't try to do everything. It does one thing precisely: turn vague intent into a clear, buildable project specification.

**Provider resilience over lock-in.**
No single LLM. A sequential chain with graceful degradation — your experience never breaks because one provider is down or rate-limited.

**Speed first, depth on demand.**
Stage 1 is fast by design. Stage 2 only runs when you need it. No wasted compute, no waiting for things you didn't ask for.

**Open by default.**
MIT licensed. The entire pipeline — prompts, providers, schema — is readable and hackable.

<br />

---

<br />

<div align="center">

MIT License · Built with [Bun](https://bun.sh) · [Hono](https://hono.dev) · [React](https://react.dev)

</div>
