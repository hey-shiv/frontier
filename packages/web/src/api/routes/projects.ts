import { Hono } from "hono";
import { getDb } from "../database/index.js";
import * as schema from "../database/schema.js";
import { eq, and } from "drizzle-orm";
import { SaveProjectSchema, IdParamSchema } from "../schemas.js";
import { safeParseJsonArray } from "../utils.js";
import type { SavedProject, ApiError } from "@frontier/shared";

export const projectsRouter = new Hono()
  .get("/saved", async (c) => {
    const sessionId = c.req.header("x-session-id")?.trim() || "anonymous";
    const database = await getDb();

    if (!database) {
      return c.json({ projects: [] }, 200);
    }

    const rows = await database
      .select()
      .from(schema.savedProjects)
      .where(eq(schema.savedProjects.sessionId, sessionId));

    const parsed: SavedProject[] = rows.map((p: any) => ({
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
  .post("/save", async (c) => {
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
    const database = await getDb();

    if (!database) {
      return c.json({ error: "Database is not configured" } satisfies ApiError, 503);
    }

    const existing = await database
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

    const [saved] = await database
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
  .delete("/saved/:id", async (c) => {
    const paramResult = IdParamSchema.safeParse({ id: c.req.param("id") });
    if (!paramResult.success) {
      return c.json({ error: "Invalid id" } satisfies ApiError, 400);
    }

    const { id } = paramResult.data;
    const sessionId = c.req.header("x-session-id")?.trim() || "anonymous";
    const database = await getDb();

    if (!database) {
      return c.json({ error: "Database is not configured" } satisfies ApiError, 503);
    }

    await database
      .delete(schema.savedProjects)
      .where(
        and(
          eq(schema.savedProjects.id, id),
          eq(schema.savedProjects.sessionId, sessionId)
        )
      );

    return c.json({ success: true }, 200);
  });
