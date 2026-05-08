import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const savedProjects = sqliteTable("saved_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  title: text("title").notNull(),
  pitch: text("pitch").notNull(),
  domains: text("domains").notNull(), // JSON array
  interests: text("interests").notNull(), // JSON array
  difficulty: text("difficulty").notNull(),
  timeEstimate: text("time_estimate").notNull(),
  originalityScore: integer("originality_score").notNull(),
  recruiterScore: integer("recruiter_score").notNull(),
  startupScore: integer("startup_score").notNull(),
  architecture: text("architecture").notNull(),
  roadmap: text("roadmap").notNull(), // JSON array
  datasets: text("datasets").notNull(), // JSON array
  apis: text("apis").notNull(), // JSON array
  deployment: text("deployment").notNull(),
  targetCompanies: text("target_companies").notNull(), // JSON array
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  focus: text("focus").notNull(), // JSON array
  stage: text("stage").notNull(),
  hiring: integer("hiring", { mode: "boolean" }).notNull().default(true),
  recentWork: text("recent_work").notNull(), // JSON array
  techStack: text("tech_stack").notNull(), // JSON array
  researchAreas: text("research_areas").notNull(), // JSON array
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
  tags: text("tags").notNull(), // JSON array
  momentum: text("momentum").notNull(), // "rising" | "hot" | "established"
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
