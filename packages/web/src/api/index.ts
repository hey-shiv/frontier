import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./database";
import * as schema from "./database/schema";
import { eq, and } from "drizzle-orm";
import { COMPANIES_DATA } from "./data/companies";
import { TRENDS_DATA } from "./data/trends";
import { generatePreviews, generateDetail } from "./data/llmChain";
import type { ProviderKeys } from "./data/llmChain";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  GenerateInputSchema,
  DetailInputSchema,
  SaveProjectSchema,
  IdParamSchema,
} from "./schemas";
import type {
  GeneratePreviewsResponse,
  GenerateDetailResponse,
  SavedProject,
  ApiError,
} from "../shared/types";

// ─── Env helpers ──────────────────────────────────────────────────────────────

function loadEnvKey(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  for (const relPath of ["../../.env", ".env"]) {
    try {
      const content = readFileSync(resolve((process as any).cwd(), relPath), "utf-8");
      const match = content.match(new RegExp(`^${key}=["']?([^"'\n]+)["']?`, "m"));
      if (match?.[1]) return match[1].trim();
    } catch {
      // file missing — try next
    }
  }
  return undefined;
}

// Load all provider keys at startup (backend-only — never sent to frontend)
const PROVIDER_KEYS: ProviderKeys = {
  geminiKey:          loadEnvKey("GEMINI_API_KEY"),
  groqKey:            loadEnvKey("GROQ_API_KEY"),
  openrouterKey:      loadEnvKey("OPENROUTER_API_KEY"),
  openrouterKey2:     loadEnvKey("OPENROUTER_API_KEY_2"),
  githubToken:        loadEnvKey("GITHUB_TOKEN"),
  semanticScholarKey: loadEnvKey("SEMANTIC_SCHOLAR_API_KEY"),
};

// Log which providers are available (never log key values)
console.log("[Frontier] LLM provider availability:");
console.log("  Gemini:",          PROVIDER_KEYS.geminiKey     ? "✓ present" : "✗ missing");
console.log("  Groq:",            PROVIDER_KEYS.groqKey       ? "✓ present" : "✗ missing");
console.log("  OpenRouter 1:",    PROVIDER_KEYS.openrouterKey ? "✓ present" : "✗ missing");
console.log("  OpenRouter 2:",    PROVIDER_KEYS.openrouterKey2 ? "✓ present" : "✗ missing");
console.log("  GitHub token:",    PROVIDER_KEYS.githubToken   ? "✓ present" : "✗ optional");
console.log("  Semantic Scholar:",PROVIDER_KEYS.semanticScholarKey ? "✓ present" : "✗ optional");

// ─── Safe JSON parse helper ───────────────────────────────────────────────────

function safeParseJsonArray(value: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

// ─── App ──────────────────────────────────────────────────────────────────────

const app = new Hono()
  .basePath("api")
  .use(cors({ origin: "*" }))

  // ── Health ──────────────────────────────────────────────────────────────────
  .get("/health", (c) => c.json({ status: "ok" }, 200))

  // ── Companies ───────────────────────────────────────────────────────────────
  .get("/companies", (c) => {
    const search = c.req.query("search")?.trim() ?? "";
    const focus  = c.req.query("focus")?.trim() ?? "";

    let filtered = COMPANIES_DATA;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (co) => co.name.toLowerCase().includes(q) || co.tagline.toLowerCase().includes(q)
      );
    }
    if (focus) {
      const q = focus.toLowerCase();
      filtered = filtered.filter((co) => co.focus.some((f) => f.toLowerCase().includes(q)));
    }
    return c.json({ companies: filtered }, 200);
  })

  .get("/companies/:slug", (c) => {
    const slug = c.req.param("slug");
    const company = COMPANIES_DATA.find((co) => co.slug === slug);
    if (!company) return c.json({ error: "Not found" } satisfies ApiError, 404);
    return c.json({ company }, 200);
  })

  // ── Trends ──────────────────────────────────────────────────────────────────
  .get("/trends", (c) => {
    const category = c.req.query("category")?.trim() ?? "";
    const momentum = c.req.query("momentum")?.trim() ?? "";

    let filtered = TRENDS_DATA;
    if (category) {
      const q = category.toLowerCase();
      filtered = filtered.filter((t) => t.category.toLowerCase().includes(q));
    }
    if (momentum) {
      filtered = filtered.filter((t) => t.momentum === momentum);
    }
    return c.json({ trends: filtered }, 200);
  })

  // ── Stage 1 — Fast preview generation ──────────────────────────────────────
  .post("/generate/previews", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" } satisfies ApiError, 400);
    }

    const result = GenerateInputSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { error: "Validation failed", details: result.error.flatten() } satisfies ApiError,
        400
      );
    }

    const input = result.data;
    const { previews, provider, warnings } = await generatePreviews(input, PROVIDER_KEYS);

    const aiGenerated = provider !== "local-fallback";
    const warning     = provider === "local-fallback" && warnings.length ? warnings[warnings.length - 1] : undefined;

    return c.json(
      {
        previews,
        meta: {
          aiGenerated,
          provider,
          generatedAt: new Date().toISOString(),
          warning,
        },
      } satisfies GeneratePreviewsResponse,
      200
    );
  })

  // ── Stage 2 — Deep generation for a single project ─────────────────────────
  .post("/generate/detail", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" } satisfies ApiError, 400);
    }

    const result = DetailInputSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { error: "Validation failed", details: result.error.flatten() } satisfies ApiError,
        400
      );
    }

    const { preview, input } = result.data;

    try {
      const { detail } = await generateDetail(preview, input, PROVIDER_KEYS);
      return c.json({ detail } satisfies GenerateDetailResponse, 200);
    } catch (err) {
      console.error("[/generate/detail] Unhandled error:", (err as Error).message);
      return c.json(
        { error: "Detail generation failed", detail: null } satisfies GenerateDetailResponse,
        500
      );
    }
  })

  // ── Legacy /generate (single-stage, preserved for backward compat) ──────────
  .post("/generate", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" } satisfies ApiError, 400);
    }

    const result = GenerateInputSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { error: "Validation failed", details: result.error.flatten() } satisfies ApiError,
        400
      );
    }

    const input = result.data;
    const { previews: projects, provider } = await generatePreviews(input, PROVIDER_KEYS);
    const aiGenerated = provider !== "local-fallback";

    return c.json(
      {
        projects,
        meta: {
          ...input,
          generatedAt: new Date().toISOString(),
          aiGenerated,
          modelUsed: provider,
        },
      },
      200
    );
  })

  // ── Saved projects ──────────────────────────────────────────────────────────
  .get("/projects/saved", async (c) => {
    const sessionId = c.req.header("x-session-id")?.trim() || "anonymous";

    const rows = await db
      .select()
      .from(schema.savedProjects)
      .where(eq(schema.savedProjects.sessionId, sessionId));

    const parsed: SavedProject[] = rows.map((p) => ({
      ...p,
      domains:           safeParseJsonArray(p.domains),
      interests:         safeParseJsonArray(p.interests),
      tags:              safeParseJsonArray(p.tags),
      requiredSkills:    safeParseJsonArray(p.requiredSkills),
      techStack:         safeParseJsonArray(p.techStack),
      recommendedModels: safeParseJsonArray(p.recommendedModels),
      datasets:          safeParseJsonArray(p.datasets),
      apis:              safeParseJsonArray(p.apis),
      evaluationMetrics: safeParseJsonArray(p.evaluationMetrics),
      roadmap:           safeParseJsonArray(p.roadmap),
      scalingIdeas:      safeParseJsonArray(p.scalingIdeas),
      futureImprovements:safeParseJsonArray(p.futureImprovements),
      targetCompanies:   safeParseJsonArray(p.targetCompanies),
      providerMeta:      JSON.parse(p.providerMeta || "{}"),
      inputProfile:      JSON.parse(p.inputProfile || "{}"),
    } as SavedProject));

    return c.json({ projects: parsed }, 200);
  })

  .post("/projects/save", async (c) => {
    const sessionId = c.req.header("x-session-id")?.trim() || "anonymous";

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" } satisfies ApiError, 400);
    }

    const result = SaveProjectSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { error: "Validation failed", details: result.error.flatten() } satisfies ApiError,
        400
      );
    }

    const data = result.data;

    const existing = await db
      .select({ id: schema.savedProjects.id })
      .from(schema.savedProjects)
      .where(
        and(
          eq(schema.savedProjects.sessionId, sessionId),
          eq(schema.savedProjects.title, data.title)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return c.json({ error: "Project already saved", id: existing[0].id }, 409);
    }

    const [saved] = await db
      .insert(schema.savedProjects)
      .values({
        sessionId,
        title:               data.title,
        pitch:               data.pitch,
        domains:             JSON.stringify([]), // domains and interests not passed inside SaveProjectSchema?
        interests:           JSON.stringify([]),
        tags:                JSON.stringify(data.tags),
        category:            data.category,
        difficulty:          data.difficulty,
        timeEstimate:        data.timeEstimate,
        researchLevel:       data.researchLevel,
        originalityScore:    data.originalityScore,
        recruiterScore:      data.recruiterScore,
        startupScore:        data.startupScore,
        publishabilityScore: data.publishabilityScore,
        researchBottleneck:  data.researchBottleneck,
        problemStatement:    data.problemStatement,
        whyItMatters:        data.whyItMatters,
        coreInnovation:      data.coreInnovation,
        architecture:        data.architecture,
        requiredSkills:      JSON.stringify(data.requiredSkills),
        techStack:           JSON.stringify(data.techStack),
        recommendedModels:   JSON.stringify(data.recommendedModels),
        datasets:            JSON.stringify(data.datasets),
        apis:                JSON.stringify(data.apis),
        evaluationMetrics:   JSON.stringify(data.evaluationMetrics),
        roadmap:             JSON.stringify(data.roadmap),
        deployment:          data.deployment,
        scalingIdeas:        JSON.stringify(data.scalingIdeas),
        futureImprovements:  JSON.stringify(data.futureImprovements),
        targetCompanies:     JSON.stringify(data.targetCompanies),
        providerMeta:        JSON.stringify(data.providerMeta),
        inputProfile:        JSON.stringify(data.inputProfile),
      })
      .returning();

    return c.json({ project: saved }, 201);
  })

  .delete("/projects/saved/:id", async (c) => {
    const paramResult = IdParamSchema.safeParse({ id: c.req.param("id") });
    if (!paramResult.success) {
      return c.json({ error: "Invalid id" } satisfies ApiError, 400);
    }

    const { id } = paramResult.data;
    const sessionId = c.req.header("x-session-id")?.trim() || "anonymous";

    await db
      .delete(schema.savedProjects)
      .where(
        and(
          eq(schema.savedProjects.id, id),
          eq(schema.savedProjects.sessionId, sessionId)
        )
      );

    return c.json({ success: true }, 200);
  })

  // ── Career roadmaps ─────────────────────────────────────────────────────────
  .get("/roadmaps", (c) => {
    const roadmaps = [
      {
        id: "ml-engineer",
        title: "ML Engineer Roadmap",
        description: "From ML fundamentals to production ML systems at top AI companies",
        targetCompanies: ["OpenAI", "DeepMind", "Anthropic", "NVIDIA"],
        duration: "6-12 months",
        difficulty: "Advanced",
        steps: [
          { phase: "Foundation",       duration: "4-6 weeks",  topics: ["Python ML stack", "Linear algebra", "Statistics", "PyTorch basics"] },
          { phase: "Core ML",          duration: "6-8 weeks",  topics: ["Supervised/unsupervised learning", "Deep learning", "CNNs/RNNs/Transformers", "Training dynamics"] },
          { phase: "LLMs & Gen AI",    duration: "6-8 weeks",  topics: ["Transformer architecture", "Pre-training", "Fine-tuning", "RLHF", "RAG systems"] },
          { phase: "MLOps",            duration: "4-6 weeks",  topics: ["Experiment tracking", "Model serving", "Monitoring", "Infrastructure"] },
          { phase: "Portfolio Projects",duration: "8-12 weeks", topics: ["End-to-end ML systems", "Open source contributions", "Research paper implementation"] },
          { phase: "Interview Prep",   duration: "4-6 weeks",  topics: ["ML system design", "Coding", "Research discussion", "Behavioral"] },
        ],
        resources: ["fast.ai", "CS231n", "Andrej Karpathy lectures", "HuggingFace course"],
      },
      {
        id: "ai-researcher",
        title: "AI Researcher Roadmap",
        description: "Path to publishing research and joining top AI labs",
        targetCompanies: ["DeepMind", "Anthropic", "OpenAI", "Meta AI"],
        duration: "12-24 months",
        difficulty: "Researcher",
        steps: [
          { phase: "Math Foundation",   duration: "8-10 weeks",  topics: ["Linear algebra", "Calculus", "Probability theory", "Information theory"] },
          { phase: "Deep Learning",     duration: "8-10 weeks",  topics: ["Backprop", "Optimization", "Architectures", "Training tricks"] },
          { phase: "Research Reading",  duration: "Ongoing",     topics: ["100 foundational papers", "arXiv daily reading", "Paper summaries", "Implementation practice"] },
          { phase: "Specialization",    duration: "12-16 weeks", topics: ["Pick 1-2 research areas", "Deep dive implementations", "Reproduce SOTA results"] },
          { phase: "Original Research", duration: "16-24 weeks", topics: ["Novel hypothesis", "Experiments", "Writing", "arXiv submission"] },
          { phase: "Community",         duration: "Ongoing",     topics: ["NeurIPS/ICML submissions", "Open source", "Blog posts", "Collaborations"] },
        ],
        resources: ["The Matrix Calculus You Need", "Deep Learning Book", "Distill.pub", "Papers With Code"],
      },
      {
        id: "ai-startup-founder",
        title: "AI Startup Founder Roadmap",
        description: "Build and launch an AI product from zero to YC-ready",
        targetCompanies: ["YC", "a16z", "Sequoia"],
        duration: "6-12 months",
        difficulty: "Advanced",
        steps: [
          { phase: "AI Literacy",  duration: "4-6 weeks",  topics: ["LLM APIs", "Prompt engineering", "Fine-tuning basics", "AI product design"] },
          { phase: "Ideation",     duration: "2-4 weeks",  topics: ["Problem identification", "Market research", "AI advantage analysis", "Validation interviews"] },
          { phase: "Build MVP",    duration: "6-8 weeks",  topics: ["Rapid prototyping", "AI integration", "Core UX", "User testing"] },
          { phase: "Launch",       duration: "2-4 weeks",  topics: ["ProductHunt", "Twitter/X", "Indie Hackers", "Early users"] },
          { phase: "Traction",     duration: "8-12 weeks", topics: ["PMF discovery", "Pricing", "Growth loops", "Metrics"] },
          { phase: "Fundraising",  duration: "4-8 weeks",  topics: ["YC application", "Pitch deck", "Investor outreach", "Due diligence"] },
        ],
        resources: ["YC Startup School", "Paul Graham Essays", "Lenny's Newsletter", "Indie Hackers"],
      },
    ];
    return c.json({ roadmaps }, 200);
  });

export type AppType = typeof app;
export default app;
