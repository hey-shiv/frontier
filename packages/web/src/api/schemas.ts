/**
 * Zod validation schemas for all Frontier API request bodies / params.
 */
import { z } from "zod";

// ─── Generate ─────────────────────────────────────────────────────────────────

export const GenerateInputSchema = z.object({
  domains: z
    .array(z.string().min(1).max(80))
    .min(1, "Select at least one AI domain")
    .max(10, "Too many domains"),
  interests: z.array(z.string().min(1).max(80)).max(10).default([]),
  companies: z.array(z.string().min(1).max(80)).max(10).default([]),
  experience: z
    .enum(["Beginner", "Intermediate", "Advanced", "Researcher"])
    .default("Intermediate"),
  goal: z
    .enum(["Internship", "Research", "Startup", "Open Source", "Freelancing", "Content Creation"])
    .default("Research"),
  timeCommitment: z
    .enum(["1 week", "1 month", "3 months", "6 months"])
    .default("1 month"),
  // Random nonce to bypass server-side cache — frontend sends Date.now() each generate click
  seed: z.number().optional(),
});

export type GenerateInputParsed = z.infer<typeof GenerateInputSchema>;

// ─── Generate detail ──────────────────────────────────────────────────────────

const PreviewSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  pitch: z.string(),
  tags: z.array(z.string()).default([]),
  category: z.string().default("AI Systems"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Researcher"]).default("Advanced"),
  timeEstimate: z.string().default(""),
  researchLevel: z.enum(["Internship", "Research", "Startup", "Publishable"]).default("Research"),
  originalityScore: z.number(),
  recruiterScore: z.number(),
  startupScore: z.number(),
  publishabilityScore: z.number().default(80),
  researchBottleneck: z.string().default(""),
  targetCompanies: z.array(z.string()).default([]),
});

export const DetailInputSchema = z.object({
  preview: PreviewSchema,
  input: GenerateInputSchema,
});

// ─── Save project ─────────────────────────────────────────────────────────────

export const SaveProjectSchema = z.object({
  title: z.string().min(1).max(300),
  pitch: z.string().min(1).max(1000),
  tags: z.array(z.string().max(80)).default([]),
  category: z.string().default("AI Systems"),
  difficulty: z.string().min(1).max(50),
  timeEstimate: z.string().min(1).max(100),
  researchLevel: z.enum(["Internship", "Research", "Startup", "Publishable"]).default("Research"),
  originalityScore: z.number().int().min(0).max(100),
  recruiterScore: z.number().int().min(0).max(100),
  startupScore: z.number().int().min(0).max(100),
  publishabilityScore: z.number().int().min(0).max(100).default(80),
  researchBottleneck: z.string().default(""),
  problemStatement: z.string().default(""),
  whyItMatters: z.string().default(""),
  coreInnovation: z.string().default(""),
  architecture: z.string().max(2000).default(""),
  requiredSkills: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  recommendedModels: z.array(z.string()).default([]),
  datasets: z.array(z.string().max(200)).default([]),
  apis: z.array(z.string().max(200)).default([]),
  evaluationMetrics: z.array(z.string()).default([]),
  roadmap: z.array(z.string().max(300)).default([]),
  deployment: z.string().max(500).default(""),
  scalingIdeas: z.array(z.string()).default([]),
  futureImprovements: z.array(z.string()).default([]),
  targetCompanies: z.array(z.string().max(100)).default([]),
  providerMeta: z.record(z.string(), z.any()).default({}),
  inputProfile: z.record(z.string(), z.any()).default({}),
});

export type SaveProjectParsed = z.infer<typeof SaveProjectSchema>;

// ─── Route params ─────────────────────────────────────────────────────────────

export const IdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\\d+$/, "id must be a positive integer")
    .transform(Number),
});
