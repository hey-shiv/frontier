/**
 * OpenRouter provider — final LLM fallback in the chain.
 * Uses free-tier models only, attempted sequentially (no racing).
 *
 * Re-exports shared types so existing imports from this file keep working.
 */

export type {
  ProjectPreview,
  ProjectDetail,
  ProjectRecommendation,
  GenerateInput,
} from "@frontier/shared";

// ─── Free models (sequential, not raced) ─────────────────────────────────────

const PREVIEW_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "openai/gpt-oss-20b:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

const DEEP_MODELS = [
  "openai/gpt-oss-120b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free",
  "qwen/qwen3-coder:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

// ─── HTTP ─────────────────────────────────────────────────────────────────────

async function callModel(
  model: string,
  messages: { role: string; content: string }[],
  apiKey: string,
  maxTokens: number
): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://frontier.ai",
      "X-Title": "Frontier AI Career Intelligence",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.85,
      max_tokens: maxTokens,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (res.status === 429) throw new Error(`RATE_LIMIT:${model}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${model} HTTP ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json() as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

/** Try models one at a time — stop at first success. No parallel racing. */
async function tryModelsSequential(
  models: string[],
  messages: { role: string; content: string }[],
  apiKey: string,
  maxTokens: number,
  minLength = 100
): Promise<string> {
  for (const model of models) {
    try {
      console.log(`[OpenRouter] Trying: ${model}`);
      const result = await callModel(model, messages, apiKey, maxTokens);
      if (result && result.length >= minLength) {
        console.log(`[OpenRouter] Success: ${model}`);
        return result;
      }
      console.warn(`[OpenRouter] ${model}: too short (${result.length} chars), trying next`);
    } catch (e: any) {
      console.warn(`[OpenRouter] ${model} failed: ${e.message?.slice(0, 120)}`);
    }
  }
  throw new Error("All OpenRouter models exhausted");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function callOpenRouterForPreviews(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  return tryModelsSequential(
    PREVIEW_MODELS,
    [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    apiKey,
    1200,
    150
  );
}

export async function callOpenRouterForDetail(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  return tryModelsSequential(
    DEEP_MODELS,
    [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    apiKey,
    2200,
    200
  );
}
