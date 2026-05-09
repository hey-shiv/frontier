# Task: Multi-provider LLM chain + enrichment + fix repeated projects

## Plan
1. Update .env with Gemini + Groq + OpenRouter keys
2. Update shared/types.ts — provider field in meta
3. Create packages/web/src/api/data/enrichment.ts — GitHub/HN/arXiv/OpenAlex cache
4. Create packages/web/src/api/data/gemini.ts — Gemini provider
5. Create packages/web/src/api/data/groq.ts — Groq provider
6. Rewrite openrouter.ts — OpenRouter-only provider (remove racing, keep sequential)
7. Create packages/web/src/api/data/llmChain.ts — orchestrator: Gemini→Groq→OpenRouter→local
8. Rewrite mockGenerator.ts — fully dynamic, zero DEFAULT_PROJECTS
9. Update api/index.ts — use llmChain, expose provider in meta
10. Update generate.tsx — show provider badge
11. Update schemas.ts — no changes needed
12. Run typecheck + tests
13. Commit on fix/ branch and push
