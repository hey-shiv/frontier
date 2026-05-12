import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { ProjectPreview, ProjectDetail } from "@frontier/shared";

export const previewCache = sqliteTable("preview_cache", {
  id: text("id").primaryKey(),
  data: text("data", { mode: "json" }).$type<ProjectPreview[]>().notNull(),
  provider: text("provider").notNull(),
  ts: integer("ts", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const detailCache = sqliteTable("detail_cache", {
  id: text("id").primaryKey(),
  data: text("data", { mode: "json" }).$type<ProjectDetail>().notNull(),
  provider: text("provider").notNull(),
  ts: integer("ts", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const savedProjects = sqliteTable("saved_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  title: text("title").notNull(),
  pitch: text("pitch").notNull(),
  domains: text("domains", { mode: "json" }).$type<string[]>().notNull(),
  interests: text("interests", { mode: "json" }).$type<string[]>().notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  timeEstimate: text("time_estimate").notNull(),
  researchLevel: text("research_level").notNull(),
  originalityScore: integer("originality_score").notNull(),
  recruiterScore: integer("recruiter_score").notNull(),
  startupScore: integer("startup_score").notNull(),
  publishabilityScore: integer("publishability_score").notNull(),
  researchBottleneck: text("research_bottleneck").notNull(),
  problemStatement: text("problem_statement").notNull(),
  whyItMatters: text("why_it_matters").notNull(),
  coreInnovation: text("core_innovation").notNull(),
  architecture: text("architecture").notNull(),
  requiredSkills: text("required_skills", { mode: "json" }).$type<string[]>().notNull(),
  techStack: text("tech_stack", { mode: "json" }).$type<string[]>().notNull(),
  recommendedModels: text("recommended_models", { mode: "json" }).$type<string[]>().notNull(),
  datasets: text("datasets", { mode: "json" }).$type<string[]>().notNull(),
  apis: text("apis", { mode: "json" }).$type<string[]>().notNull(),
  evaluationMetrics: text("evaluation_metrics", { mode: "json" }).$type<string[]>().notNull(),
  roadmap: text("roadmap", { mode: "json" }).$type<string[]>().notNull(),
  deployment: text("deployment").notNull(),
  scalingIdeas: text("scaling_ideas", { mode: "json" }).$type<string[]>().notNull(),
  futureImprovements: text("future_improvements", { mode: "json" }).$type<string[]>().notNull(),
  targetCompanies: text("target_companies", { mode: "json" }).$type<string[]>().notNull(),
  providerMeta: text("provider_meta", { mode: "json" }).$type<Record<string, any>>().notNull(),
  inputProfile: text("input_profile", { mode: "json" }).$type<Record<string, any>>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  focus: text("focus", { mode: "json" }).$type<string[]>().notNull(),
  stage: text("stage").notNull(),
  hiring: integer("hiring", { mode: "boolean" }).notNull().default(true),
  recentWork: text("recent_work", { mode: "json" }).$type<string[]>().notNull(),
  techStack: text("tech_stack", { mode: "json" }).$type<string[]>().notNull(),
  researchAreas: text("research_areas", { mode: "json" }).$type<string[]>().notNull(),
  website: text("website"),
  logoColor: text("logo_color").notNull(),
  openRoles: integer("open_roles").notNull().default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const trends = sqliteTable("trends", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  momentum: text("momentum").notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
