/**
 * Frontier — Shared types used by both API (Hono) and web frontend.
 * Keep this file free of framework imports so it works anywhere.
 */

// ─── Project types ────────────────────────────────────────────────────────────

export interface ProjectPreview {
  id: string;
  title: string;
  pitch: string;
  tags: string[];
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Researcher";
  timeEstimate: string;
  researchLevel: "Internship" | "Research" | "Startup" | "Publishable";
  originalityScore: number;
  recruiterScore: number;
  startupScore: number;
  publishabilityScore: number;
  researchBottleneck: string;
  targetCompanies: string[];
}

export interface ProjectDetail extends ProjectPreview {
  problemStatement: string;
  whyItMatters: string;
  coreInnovation: string;
  architecture: string;
  requiredSkills: string[];
  techStack: string[];
  recommendedModels: string[];
  datasets: string[];
  apis: string[];
  evaluationMetrics: string[];
  roadmap: string[];
  deployment: string;
  scalingIdeas: string[];
  futureImprovements: string[];
}

/** Alias — the generate page and project-card both use this shape */
export type ProjectRecommendation = ProjectDetail;

// ─── Generate API ─────────────────────────────────────────────────────────────

export interface GenerateInput {
  domains: string[];
  interests: string[];
  companies: string[];
  experience: string;
  goal: string;
  timeCommitment: string;
  /** Random nonce — forces a fresh generation instead of returning cached results */
  seed?: number;
}

export type LLMProvider = "gemini" | "groq" | "openrouter" | "local-fallback";

export interface GeneratePreviewsResponse {
  previews: ProjectPreview[];
  meta: {
    aiGenerated: boolean;
    /** Which provider actually produced the result */
    provider: LLMProvider;
    generatedAt: string;
    /** Set when a provider failed and we fell back */
    warning?: string;
  };
}

export interface GenerateDetailResponse {
  detail: ProjectDetail | null;
  error?: string;
}

// ─── Saved projects ───────────────────────────────────────────────────────────

/** Shape returned from GET /api/projects/saved after JSON columns are parsed */
export interface SavedProject {
  id: number;
  sessionId: string;
  title: string;
  pitch: string;
  domains: string[];
  interests: string[];
  difficulty: string;
  timeEstimate: string;
  originalityScore: number;
  recruiterScore: number;
  startupScore: number;
  architecture: string;
  roadmap: string[];
  datasets: string[];
  apis: string[];
  deployment: string;
  targetCompanies: string[];
  createdAt: Date;
}

// ─── Company types ────────────────────────────────────────────────────────────

export interface Company {
  id?: number;
  name: string;
  slug: string;
  tagline: string;
  focus: string[];
  stage: string;
  hiring: boolean;
  recentWork: string[];
  techStack: string[];
  researchAreas: string[];
  website?: string;
  logoColor: string;
  openRoles: number;
}

// ─── Trend types ──────────────────────────────────────────────────────────────

export type TrendMomentum = "rising" | "hot" | "established";

export interface Trend {
  id?: number;
  title: string;
  description: string;
  category: string;
  source: string;
  sourceUrl?: string;
  tags: string[];
  momentum: TrendMomentum;
  publishedAt: Date | string;
}

// ─── Roadmap types ────────────────────────────────────────────────────────────

export interface RoadmapStep {
  phase: string;
  duration: string;
  topics: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  targetCompanies: string[];
  duration: string;
  difficulty: string;
  steps: RoadmapStep[];
  resources: string[];
}

// ─── API error shape ──────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  details?: unknown;
}
