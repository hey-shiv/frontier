/**
 * API schema validation tests
 * Run: cd packages/web && bun test src/__tests__/api-schemas.test.ts
 */
import { describe, expect, test } from "bun:test";
import { GenerateInputSchema as GeneratePreviewsSchema, SaveProjectSchema } from "../api/schemas";

// ─── GeneratePreviewsSchema ───────────────────────────────────────────────────

describe("GeneratePreviewsSchema", () => {
  const valid = {
    domains: ["LLMs", "RAG Systems"],
    interests: ["Music"],
    companies: ["OpenAI"],
    experience: "Intermediate",
    goal: "Startup",
    timeCommitment: "3 months",
  };

  test("accepts valid payload", () => {
    const result = GeneratePreviewsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  test("rejects empty domains", () => {
    const result = GeneratePreviewsSchema.safeParse({ ...valid, domains: [] });
    expect(result.success).toBe(false);
  });

  test("rejects domains with >10 items", () => {
    const result = GeneratePreviewsSchema.safeParse({
      ...valid,
      domains: Array.from({ length: 11 }, (_, i) => `Domain${i}`),
    });
    expect(result.success).toBe(false);
  });

  test("fills optional fields with defaults", () => {
    const minimal = { domains: ["LLMs"], experience: "Intermediate", goal: "Startup", timeCommitment: "1 month" };
    const result = GeneratePreviewsSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.interests).toEqual([]);
      expect(result.data.companies).toEqual([]);
    }
  });
});

// ─── SaveProjectSchema ────────────────────────────────────────────────────────

describe("SaveProjectSchema", () => {
  const valid = {
    title: "Neural Composer",
    pitch: "AI-powered music generation system.",
    difficulty: "Intermediate",
    timeEstimate: "3 months",
    originalityScore: 88,
    recruiterScore: 82,
    startupScore: 79,
    architecture: "Transformer-based seq2seq model",
    roadmap: ["Step 1", "Step 2"],
    datasets: ["MIDI dataset"],
    apis: ["Suno API"],
    deployment: "Dockerized FastAPI",
    targetCompanies: ["OpenAI"],
    tags: ["music", "generative"],
    category: "Audio AI",
    researchLevel: "Startup",
  };

  test("accepts valid project", () => {
    const result = SaveProjectSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  test("rejects missing title", () => {
    const { title: _, ...without } = valid;
    const result = SaveProjectSchema.safeParse(without);
    expect(result.success).toBe(false);
  });

  test("rejects score out of range", () => {
    const result = SaveProjectSchema.safeParse({ ...valid, originalityScore: 150 });
    expect(result.success).toBe(false);
  });

  test("rejects negative score", () => {
    const result = SaveProjectSchema.safeParse({ ...valid, recruiterScore: -1 });
    expect(result.success).toBe(false);
  });
});
