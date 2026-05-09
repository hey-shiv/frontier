/**
 * OpenRouter AI client — Two-Stage Generation Architecture
 * Stage 1: Fast preview (< 5s) — titles, pitches, scores
 * Stage 2: On-demand deep generation per project
 */

// Re-export shared types so existing imports from this file keep working
export type {
  ProjectPreview,
  ProjectDetail,
  ProjectRecommendation,
  GenerateInput,
} from "../../shared/types";

import type {
  ProjectPreview,
  ProjectDetail,
  GenerateInput,
} from "../../shared/types";

// ─── Models ──────────────────────────────────────────────────────────────────

// Fast models for Stage 1 (race) — verified live as of 2026-05
const FAST_MODELS = [
  "openai/gpt-oss-20b:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "google/gemma-4-31b-it:free",
  "openai/gpt-oss-120b:free",
];

// Capable models for Stage 2 deep gen (race) — verified live as of 2026-05
const DEEP_MODELS = [
  "openai/gpt-oss-120b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free",
  "qwen/qwen3-coder:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "openai/gpt-oss-20b:free",
];

// ─── In-memory cache ──────────────────────────────────────────────────────────

const previewCache = new Map<string, { data: ProjectPreview[]; ts: number }>();
const detailCache = new Map<string, { data: ProjectDetail; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 min

function cacheKey(input: GenerateInput) {
  return JSON.stringify({
    d: [...input.domains].sort(),
    i: [...input.interests].sort(),
    c: [...input.companies].sort(),
    e: input.experience,
    g: input.goal,
    t: input.timeCommitment,
    // seed is a random nonce sent per-request — makes every generate call unique
    s: input.seed ?? null,
  });
}

function detailCacheKey(projectId: string, input: GenerateInput) {
  return `${projectId}::${cacheKey(input)}`;
}

// ─── HTTP ────────────────────────────────────────────────────────────────────

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
      temperature: 0.8,
      max_tokens: maxTokens,
    }),
  });

  if (res.status === 429) throw new Error(`RATE_LIMIT:${model}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${model} HTTP ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Try models one at a time (sequential) — stops at the first success.
 * This prevents burning multiple credits in parallel on a low-balance account.
 */
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
      console.warn(`[OpenRouter] ${model}: response too short (${result.length} chars), trying next`);
    } catch (e: any) {
      console.warn(`[OpenRouter] ${model} failed: ${e.message?.slice(0, 120)}`);
    }
  }
  throw new Error("All OpenRouter models exhausted");
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function cleanJSON(raw: string): string {
  // Strip <think>...</think> from qwen/deepseek
  let s = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  // Strip code fences
  s = s.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();
  return s;
}

function extractArray(raw: string): any[] {
  const s = cleanJSON(raw);
  const m = s.match(/\[[\s\S]*\]/);
  if (!m) throw new Error("No JSON array in response");
  return JSON.parse(m[0]);
}

function extractObject(raw: string): any {
  const s = cleanJSON(raw);
  const m = s.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("No JSON object in response");
  return JSON.parse(m[0]);
}

function clamp(v: any, def = 82): number {
  const n = Number(v);
  return isNaN(n) ? def : Math.min(99, Math.max(60, n));
}

function arr(v: any): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string" && v.length) return [v];
  return [];
}

// ─── Stage 1 — Fast Previews ──────────────────────────────────────────────────

const PREVIEW_SYSTEM = `You are an elite AI research director. Generate concise, high-signal project previews.
Output ONLY a valid JSON array. No markdown, no prose, no code fences.`;

function buildPreviewUserPrompt(input: GenerateInput): string {
  const { domains, interests, companies, experience, goal, timeCommitment, seed } = input;

  // Build ALL pairwise domain × interest combos so every selection influences output
  const allCombos = domains.flatMap(d =>
    (interests.length > 0 ? interests : ["AI"]).map(i => `${d} × ${i}`)
  );
  // Pick 4 distinct combos to assign one per project (round-robin if fewer than 4)
  const assignedCombos = [0, 1, 2, 3].map(i => allCombos[i % allCombos.length]);

  return `Variation seed: ${seed ?? Date.now()} — use this to ensure unique output each call.

Generate EXACTLY 4 project PREVIEWS for a ${experience}-level developer.

== USER PROFILE ==
Goal: ${goal}
Time available: ${timeCommitment}
ALL selected domains: ${domains.join(", ")}
ALL selected interests: ${interests.join(", ") || "general technology"}
ALL target companies: ${companies.join(", ") || "top AI labs"}

== REQUIRED INTERSECTIONS (one per project) ==
Project 1 must combine: ${assignedCombos[0]}
Project 2 must combine: ${assignedCombos[1]}
Project 3 must combine: ${assignedCombos[2]}
Project 4 must combine: ${assignedCombos[3]}

Each project MUST:
- Be inspired by the assigned domain × interest intersection above
- Be relevant to at least one of the target companies listed
- Name a specific architecture, model, or technique in the title
- Have a unique angle — no two projects may share the same category

Return ONLY this JSON array (no markdown, no prose):
[
  {
    "id": "kebab-slug-unique",
    "title": "Specific technical title naming an architecture or technique",
    "pitch": "One sharp sentence: what it does + why technically impressive",
    "researchBottleneck": "The exact unsolved technical problem this tackles (1 sentence)",
    "tags": ["tag1", "tag2", "tag3", "tag4"],
    "category": "e.g. Generative Audio",
    "difficulty": "${experience === "Beginner" ? "Beginner|Intermediate" : experience === "Researcher" ? "Advanced|Researcher" : "Intermediate|Advanced"}",
    "timeEstimate": "realistic estimate within ${timeCommitment}",
    "researchLevel": "${goal === "Internship" ? "Internship" : goal === "Research" ? "Research|Publishable" : goal === "Startup" ? "Startup" : "Research"}",
    "originalityScore": <integer 80-99>,
    "recruiterScore": <integer 75-99>,
    "startupScore": <integer 65-99>,
    "publishabilityScore": <integer 65-99>,
    "targetCompanies": ["pick 1-2 from: ${companies.join(", ") || "OpenAI, DeepMind, Anthropic"}"]
  }
]

Hard rules:
- Exactly 4 items, no more, no less
- NEVER generic CRUD, chatbots, or todo apps
- Each project uses a different primary domain from the list
- Scores must differ between projects (no identical score rows)`;
}

export async function generatePreviewsWithAI(
  input: GenerateInput,
  apiKey: string
): Promise<ProjectPreview[]> {
  const key = cacheKey(input);
  const cached = previewCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log("[Stage1] Cache hit");
    return cached.data;
  }

  console.log("[Stage1] Generating previews (fast)...");

  const messages = [
    { role: "system", content: PREVIEW_SYSTEM },
    { role: "user", content: buildPreviewUserPrompt(input) },
  ];

  const raw = await tryModelsSequential(FAST_MODELS, messages, apiKey, 1100, 150);
  const parsed = extractArray(raw);

  const previews: ProjectPreview[] = parsed.map((p: any, idx: number) => ({
    id: p.id || `project-${Date.now()}-${idx}`,
    title: p.title || "Untitled",
    pitch: p.pitch || "",
    researchBottleneck: p.researchBottleneck || "",
    tags: arr(p.tags),
    category: p.category || "AI Systems",
    difficulty: p.difficulty || "Advanced",
    timeEstimate: p.timeEstimate || "4-6 weeks",
    researchLevel: p.researchLevel || "Research",
    originalityScore: clamp(p.originalityScore),
    recruiterScore: clamp(p.recruiterScore),
    startupScore: clamp(p.startupScore),
    publishabilityScore: clamp(p.publishabilityScore),
    targetCompanies: arr(p.targetCompanies),
  }));

  previewCache.set(key, { data: previews, ts: Date.now() });
  console.log(`[Stage1] Done — ${previews.length} previews`);
  return previews;
}

// ─── Stage 2 — Deep Generation ────────────────────────────────────────────────

const DEEP_SYSTEM = `You are an elite AI research engineer. Write a research-grade project blueprint.
Output ONLY a valid JSON object. No markdown, no prose, no code fences.
Use exact architectures, loss functions, dataset names, and evaluation metrics.`;

function buildDeepUserPrompt(preview: ProjectPreview, input: GenerateInput): string {
  const { domains, interests, companies, experience, goal, timeCommitment } = input;

  return `Generate a DEEP TECHNICAL BLUEPRINT for this specific project:

Title: "${preview.title}"
Pitch: "${preview.pitch}"
Research bottleneck: "${preview.researchBottleneck}"
Category: ${preview.category}

User context:
- Domains: ${domains.join(", ")}
- Interests: ${interests.join(", ") || "general"}
- Target companies: ${companies.join(", ") || preview.targetCompanies.join(", ")}
- Experience: ${experience} | Goal: ${goal} | Time: ${timeCommitment}

Return ONLY this JSON object:
{
  "problemStatement": "2 sentences: specific research problem, cite limitations of existing models by name",
  "whyItMatters": "2 sentences: who needs this, why now",
  "coreInnovation": "The ONE novel technical contribution that makes this different from prior work",
  "architecture": "SPECIFIC: ComponentA (e.g. EnCodec tokenizer) → ComponentB (e.g. Latent DiT) → ComponentC (decoder). Name exact loss functions.",
  "requiredSkills": ["PyTorch", "specific skill 2", "specific skill 3", "specific skill 4"],
  "techStack": ["PyTorch", "lib1", "lib2", "lib3", "lib4", "lib5"],
  "recommendedModels": ["exact/model-name-1", "exact/model-name-2", "exact/model-name-3"],
  "datasets": ["EXACT Dataset 1 (e.g. MAESTRO v3.0)", "EXACT Dataset 2", "EXACT Dataset 3"],
  "apis": ["Exact API 1", "Exact API 2", "Exact API 3"],
  "evaluationMetrics": ["Metric 1 (e.g. Fréchet Audio Distance)", "Metric 2", "Metric 3"],
  "roadmap": [
    "Week 1-2: specific milestone with deliverable",
    "Week 3-4: specific milestone with deliverable",
    "Week 5-6: specific milestone with deliverable",
    "Week 7-8: specific milestone with deliverable"
  ],
  "deployment": "Specific stack + hosting + serving strategy",
  "scalingIdeas": ["Concrete scaling idea 1", "Concrete scaling idea 2"],
  "futureImprovements": ["Research direction 1", "Direction 2", "Direction 3"]
}

Be maximally specific. Name exact architectures, loss functions, datasets, metrics. No generic advice.`;
}

export async function generateProjectDetailWithAI(
  preview: ProjectPreview,
  input: GenerateInput,
  apiKey: string
): Promise<ProjectDetail> {
  const key = detailCacheKey(preview.id, input);
  const cached = detailCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log(`[Stage2] Cache hit: ${preview.id}`);
    return cached.data;
  }

  console.log(`[Stage2] Deep gen: "${preview.title}"`);

  const messages = [
    { role: "system", content: DEEP_SYSTEM },
    { role: "user", content: buildDeepUserPrompt(preview, input) },
  ];

  const raw = await tryModelsSequential(DEEP_MODELS, messages, apiKey, 2000, 200);
  const p = extractObject(raw);

  const detail: ProjectDetail = {
    ...preview,
    problemStatement: p.problemStatement || "",
    whyItMatters: p.whyItMatters || "",
    coreInnovation: p.coreInnovation || "",
    architecture: p.architecture || "",
    requiredSkills: arr(p.requiredSkills),
    techStack: arr(p.techStack),
    recommendedModels: arr(p.recommendedModels),
    datasets: arr(p.datasets),
    apis: arr(p.apis),
    evaluationMetrics: arr(p.evaluationMetrics),
    roadmap: arr(p.roadmap),
    deployment: p.deployment || "",
    scalingIdeas: arr(p.scalingIdeas),
    futureImprovements: arr(p.futureImprovements),
  };

  detailCache.set(key, { data: detail, ts: Date.now() });
  console.log(`[Stage2] Done: "${preview.title}"`);
  return detail;
}

// ─── Legacy compat (mock fallback uses this shape) ────────────────────────────
export async function generateProjectsWithAI(
  input: GenerateInput,
  apiKey: string
): Promise<ProjectDetail[]> {
  // Used only as fallback path — returns previews with empty detail fields
  const previews = await generatePreviewsWithAI(input, apiKey);
  return previews.map(p => ({
    ...p,
    problemStatement: "",
    whyItMatters: "",
    coreInnovation: "",
    architecture: "",
    requiredSkills: [],
    techStack: [],
    recommendedModels: [],
    datasets: [],
    apis: [],
    evaluationMetrics: [],
    roadmap: [],
    deployment: "",
    scalingIdeas: [],
    futureImprovements: [],
  }));
}
