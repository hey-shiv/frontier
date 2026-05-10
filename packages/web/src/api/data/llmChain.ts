/**
 * LLM provider chain orchestrator.
 *
 * Priority order (sequential — NO parallel racing):
 *   1. Gemini 2.0 Flash (free, fast)
 *   2. Groq (free, fast)
 *   3. OpenRouter free models (sequential)
 *   4. Local dynamic fallback (mockGenerator)
 *
 * Each provider is only tried if the previous one fails.
 * Exactly one active LLM request per generate click.
 */

import type { GenerateInput, ProjectPreview, ProjectDetail, LLMProvider } from "../../shared/types";
import { callGemini } from "./gemini";
import { callGroq } from "./groq";
import { callOpenRouterForPreviews, callOpenRouterForDetail } from "./openrouter";
import {
  PREVIEW_SYSTEM_PROMPT,
  DEEP_SYSTEM_PROMPT,
  buildPreviewUserPrompt,
  buildDeepUserPrompt,
} from "./promptBuilder";
import { generateProjects } from "./mockGenerator";
import { gatherEnrichment } from "./enrichment";
import type { EnrichmentContext } from "./enrichment";

// ─── Provider credentials (loaded once at module init) ───────────────────────

export interface ProviderKeys {
  geminiKey?: string;
  groqKey?: string;
  openrouterKey?: string;
  openrouterKey2?: string;
  githubToken?: string;
  semanticScholarKey?: string;
}

// ─── JSON parsing helpers ─────────────────────────────────────────────────────

function cleanJSON(raw: string): string {
  let s = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  s = s.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();
  return s;
}

function extractArray(raw: string): unknown[] {
  const s = cleanJSON(raw);
  const m = s.match(/\[[\s\S]*\]/);
  if (!m) throw new Error("No JSON array found in LLM response");
  return JSON.parse(m[0]) as unknown[];
}

function extractObject(raw: string): Record<string, unknown> {
  const s = cleanJSON(raw);
  const m = s.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("No JSON object found in LLM response");
  return JSON.parse(m[0]) as Record<string, unknown>;
}

function clamp(v: unknown, def = 82): number {
  const n = Number(v);
  return isNaN(n) ? def : Math.min(99, Math.max(60, n));
}

function arr(v: unknown): string[] {
  if (Array.isArray(v)) return (v as unknown[]).map(String).filter(Boolean);
  if (typeof v === "string" && v.length) return [v];
  return [];
}

// ─── Preview parsing ──────────────────────────────────────────────────────────

function parsePreviewArray(raw: string): ProjectPreview[] {
  const items = extractArray(raw);
  if (!Array.isArray(items) || items.length === 0) throw new Error("Empty preview array");

  return (items as Record<string, unknown>[]).slice(0, 4).map((p, idx) => ({
    id: (p.id as string) || `project-${Date.now()}-${idx}`,
    title: (p.title as string) || "Untitled",
    pitch: (p.pitch as string) || "",
    researchBottleneck: (p.researchBottleneck as string) || "",
    tags: arr(p.tags),
    category: (p.category as string) || "AI Systems",
    difficulty: ((p.difficulty as string) || "Advanced") as ProjectPreview["difficulty"],
    timeEstimate: (p.timeEstimate as string) || "4-6 weeks",
    researchLevel: ((p.researchLevel as string) || "Research") as ProjectPreview["researchLevel"],
    originalityScore: clamp(p.originalityScore),
    recruiterScore: clamp(p.recruiterScore),
    startupScore: clamp(p.startupScore),
    publishabilityScore: clamp(p.publishabilityScore),
    targetCompanies: arr(p.targetCompanies),
  }));
}

// ─── Detail parsing ───────────────────────────────────────────────────────────

function parseDetailObject(raw: string, preview: ProjectPreview): ProjectDetail {
  const p = extractObject(raw);
  return {
    ...preview,
    problemStatement: (p.problemStatement as string) || "",
    whyItMatters: (p.whyItMatters as string) || "",
    coreInnovation: (p.coreInnovation as string) || "",
    architecture: (p.architecture as string) || "",
    requiredSkills: arr(p.requiredSkills),
    techStack: arr(p.techStack),
    recommendedModels: arr(p.recommendedModels),
    datasets: arr(p.datasets),
    apis: arr(p.apis),
    evaluationMetrics: arr(p.evaluationMetrics),
    roadmap: arr(p.roadmap),
    deployment: (p.deployment as string) || "",
    scalingIdeas: arr(p.scalingIdeas),
    futureImprovements: arr(p.futureImprovements),
  };
}

// ─── Preview cache ────────────────────────────────────────────────────────────

const previewCache = new Map<string, { data: ProjectPreview[]; provider: LLMProvider; ts: number }>();
const detailCache  = new Map<string, { data: ProjectDetail; provider: LLMProvider; ts: number }>();
const PREVIEW_TTL  = 10 * 60 * 1000; // 10 min (seed already busts cache per click)
const DETAIL_TTL   = 30 * 60 * 1000;

function previewCacheKey(input: GenerateInput) {
  return JSON.stringify({
    d: [...input.domains].sort(),
    i: [...input.interests].sort(),
    c: [...input.companies].sort(),
    e: input.experience,
    g: input.goal,
    t: input.timeCommitment,
    s: input.seed ?? null,
  });
}

function detailCacheKey(projectId: string, input: GenerateInput) {
  return `${projectId}::${previewCacheKey(input)}`;
}

// ─── Preview generation ───────────────────────────────────────────────────────

export interface PreviewResult {
  previews: ProjectPreview[];
  provider: LLMProvider;
  warnings: string[];
}

export async function generatePreviews(
  input: GenerateInput,
  keys: ProviderKeys
): Promise<PreviewResult> {
  const ckey = previewCacheKey(input);
  const cached = previewCache.get(ckey);
  if (cached && Date.now() - cached.ts < PREVIEW_TTL) {
    console.log("[LLMChain] Preview cache hit");
    return { previews: cached.data, provider: cached.provider, warnings: [] };
  }

  // Gather enrichment (non-blocking, never throws)
  let enrichment: EnrichmentContext | undefined;
  try {
    console.log("[LLMChain] Gathering enrichment signals...");
    enrichment = await gatherEnrichment(input.domains, input.interests, input.companies, {
      githubToken: keys.githubToken,
      semanticScholarKey: keys.semanticScholarKey,
    });
    console.log("[LLMChain] Enrichment gathered");
  } catch (e: any) {
    console.warn("[LLMChain] Enrichment failed (non-fatal):", e.message);
  }

  const userPrompt = buildPreviewUserPrompt(input, enrichment);
  const warnings: string[] = [];

  // ── 1. Gemini ──────────────────────────────────────────────────────────────
  if (keys.geminiKey) {
    try {
      console.log("[LLMChain] Trying Gemini...");
      const raw = await callGemini(PREVIEW_SYSTEM_PROMPT, userPrompt, keys.geminiKey, 1400);
      const previews = parsePreviewArray(raw);
      console.log(`[LLMChain] Gemini success — ${previews.length} previews`);
      previewCache.set(ckey, { data: previews, provider: "gemini", ts: Date.now() });
      return { previews, provider: "gemini", warnings };
    } catch (e: any) {
      const msg = e.message?.slice(0, 150) ?? "unknown";
      console.warn(`[LLMChain] Gemini failed: ${msg}`);
      warnings.push(`Gemini failed: ${msg}`);
    }
  }

  // ── 2. Groq ────────────────────────────────────────────────────────────────
  if (keys.groqKey) {
    try {
      console.log("[LLMChain] Trying Groq...");
      const raw = await callGroq(PREVIEW_SYSTEM_PROMPT, userPrompt, keys.groqKey, 1400);
      const previews = parsePreviewArray(raw);
      console.log(`[LLMChain] Groq success — ${previews.length} previews`);
      previewCache.set(ckey, { data: previews, provider: "groq", ts: Date.now() });
      return { previews, provider: "groq", warnings };
    } catch (e: any) {
      const msg = e.message?.slice(0, 150) ?? "unknown";
      console.warn(`[LLMChain] Groq failed: ${msg}`);
      warnings.push(`Groq failed: ${msg}`);
    }
  }

  // ── 3. OpenRouter free ────────────────────────────────────────────────────
  if (keys.openrouterKey) {
    try {
      console.log("[LLMChain] Trying OpenRouter...");
      const raw = await callOpenRouterForPreviews(PREVIEW_SYSTEM_PROMPT, userPrompt, keys.openrouterKey);
      const previews = parsePreviewArray(raw);
      console.log(`[LLMChain] OpenRouter success — ${previews.length} previews`);
      previewCache.set(ckey, { data: previews, provider: "openrouter", ts: Date.now() });
      return { previews, provider: "openrouter", warnings };
    } catch (e: any) {
      const msg = e.message?.slice(0, 150) ?? "unknown";
      console.warn(`[LLMChain] OpenRouter failed: ${msg}`);
      warnings.push(`OpenRouter failed: ${msg}`);
    }
  }

  // ── 4. Local dynamic fallback ─────────────────────────────────────────────
  console.log("[LLMChain] All LLM providers failed — using local fallback");
  const previews = generateProjects(input) as ProjectPreview[];
  const fallbackWarning = warnings.length
    ? `All providers failed (${warnings.join(" | ")}) — using local fallback`
    : "No API keys configured — using local fallback";
  return { previews, provider: "local-fallback", warnings: [fallbackWarning] };
}

// ─── Detail generation ────────────────────────────────────────────────────────

export interface DetailResult {
  detail: ProjectDetail;
  provider: LLMProvider;
  warnings: string[];
}

export async function generateDetail(
  preview: ProjectPreview,
  input: GenerateInput,
  keys: ProviderKeys
): Promise<DetailResult> {
  const ckey = detailCacheKey(preview.id, input);
  const cached = detailCache.get(ckey);
  if (cached && Date.now() - cached.ts < DETAIL_TTL) {
    console.log(`[LLMChain] Detail cache hit: ${preview.id}`);
    return { detail: cached.data, provider: cached.provider, warnings: [] };
  }

  const userPrompt = buildDeepUserPrompt(preview, input);
  const warnings: string[] = [];

  // ── 1. Gemini ──────────────────────────────────────────────────────────────
  if (keys.geminiKey) {
    try {
      console.log(`[LLMChain] Detail: Gemini for "${preview.title}"`);
      const raw = await callGemini(DEEP_SYSTEM_PROMPT, userPrompt, keys.geminiKey, 2400);
      const detail = parseDetailObject(raw, preview);
      detailCache.set(ckey, { data: detail, provider: "gemini", ts: Date.now() });
      return { detail, provider: "gemini", warnings };
    } catch (e: any) {
      const msg = e.message?.slice(0, 150) ?? "unknown";
      warnings.push(`Gemini detail failed: ${msg}`);
    }
  }

  // ── 2. Groq ────────────────────────────────────────────────────────────────
  if (keys.groqKey) {
    try {
      console.log(`[LLMChain] Detail: Groq for "${preview.title}"`);
      const raw = await callGroq(DEEP_SYSTEM_PROMPT, userPrompt, keys.groqKey, 2400);
      const detail = parseDetailObject(raw, preview);
      detailCache.set(ckey, { data: detail, provider: "groq", ts: Date.now() });
      return { detail, provider: "groq", warnings };
    } catch (e: any) {
      const msg = e.message?.slice(0, 150) ?? "unknown";
      warnings.push(`Groq detail failed: ${msg}`);
    }
  }

  // ── 3. OpenRouter ─────────────────────────────────────────────────────────
  if (keys.openrouterKey) {
    try {
      console.log(`[LLMChain] Detail: OpenRouter for "${preview.title}"`);
      const raw = await callOpenRouterForDetail(DEEP_SYSTEM_PROMPT, userPrompt, keys.openrouterKey);
      const detail = parseDetailObject(raw, preview);
      detailCache.set(ckey, { data: detail, provider: "openrouter", ts: Date.now() });
      return { detail, provider: "openrouter", warnings };
    } catch (e: any) {
      const msg = e.message?.slice(0, 150) ?? "unknown";
      warnings.push(`OpenRouter detail failed: ${msg}`);
    }
  }

  // ── 4. OpenRouter (Secondary Key) ─────────────────────────────────────────
  if (keys.openrouterKey2) {
    try {
      console.log(`[LLMChain] Detail: OpenRouter (Secondary Key) for "${preview.title}"`);
      const raw = await callOpenRouterForDetail(DEEP_SYSTEM_PROMPT, userPrompt, keys.openrouterKey2);
      const detail = parseDetailObject(raw, preview);
      detailCache.set(ckey, { data: detail, provider: "openrouter", ts: Date.now() });
      return { detail, provider: "openrouter", warnings };
    } catch (e: any) {
      const msg = e.message?.slice(0, 150) ?? "unknown";
      warnings.push(`OpenRouter (Secondary) detail failed: ${msg}`);
    }
  }

  // ── 5. Local stub ─────────────────────────────────────────────────────────
  console.log(`[LLMChain] Detail: local stub for "${preview.title}"`);
  const fallbackWarning = warnings.length
    ? `All providers failed (${warnings.join(" | ")}) — stub details`
    : "No API keys — stub details";

  const stubDetail: ProjectDetail = {
    ...preview,
    problemStatement: `${preview.researchBottleneck || "Existing approaches lack the necessary specificity for this domain."}`,
    whyItMatters: `This project directly advances ${preview.category} and is relevant to ${preview.targetCompanies.join(", ")}.`,
    coreInnovation: preview.researchBottleneck || "Novel combination of domain knowledge with modern AI techniques.",
    architecture: `Data pipeline → ${preview.tags[0] || "Model"} layer → Inference API → Frontend UI`,
    requiredSkills: [...new Set([...preview.tags, "Python", "PyTorch"])].slice(0, 6),
    techStack: ["Python", "PyTorch", "FastAPI", "React", "Docker"],
    recommendedModels: [],
    datasets: [],
    apis: [],
    evaluationMetrics: [],
    roadmap: [
      "Week 1-2: Setup environment and data pipeline",
      "Week 3-4: Implement core model",
      "Week 5-6: Evaluate and iterate",
      "Week 7-8: Deploy and document",
    ],
    deployment: "Hugging Face Spaces + Gradio or Vercel + Railway",
    scalingIdeas: ["Scale dataset size", "Distill model for edge"],
    futureImprovements: ["Extend to new domains", "Open source the pipeline", "Add benchmarks"],
  };

  return { detail: stubDetail, provider: "local-fallback", warnings: [fallbackWarning] };
}
