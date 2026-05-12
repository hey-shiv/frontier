import type { ProviderKeys } from "./data/llmChain.js";

// ─── Env helpers ──────────────────────────────────────────────────────────────

export function loadEnvKey(key: string): string | undefined {
  return process.env[key];
}

// Load all provider keys at startup (backend-only — never sent to frontend)
export const PROVIDER_KEYS: ProviderKeys = {
  geminiKey:          loadEnvKey("GEMINI_API_KEY"),
  groqKey:            loadEnvKey("GROQ_API_KEY"),
  openrouterKey:      loadEnvKey("OPENROUTER_API_KEY"),
  openrouterKey2:     loadEnvKey("OPENROUTER_API_KEY_2"),
  githubToken:        loadEnvKey("GITHUB_TOKEN"),
  semanticScholarKey: loadEnvKey("SEMANTIC_SCHOLAR_API_KEY"),
};


