import { Hono } from "hono";
import { getDb, schema } from "@frontier/db";
import { eq, and } from "drizzle-orm";
import { SaveProjectSchema, IdParamSchema } from "../schemas.js";
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
      domains:           p.domains,
      interests:         p.interests,
      tags:              p.tags,
      requiredSkills:    p.requiredSkills,
      techStack:         p.techStack,
      recommendedModels: p.recommendedModels,
      datasets:          p.datasets,
      apis:              p.apis,
      evaluationMetrics: p.evaluationMetrics,
      roadmap:           p.roadmap,
      scalingIdeas:      p.scalingIdeas,
      futureImprovements:p.futureImprovements,
      targetCompanies:   p.targetCompanies,
      providerMeta:      p.providerMeta,
      inputProfile:      p.inputProfile,
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
        domains:             [],
        interests:           [],
        tags:                data.tags,
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
        requiredSkills:      data.requiredSkills,
        techStack:           data.techStack,
        recommendedModels:   data.recommendedModels,
        datasets:            data.datasets,
        apis:                data.apis,
        evaluationMetrics:   data.evaluationMetrics,
        roadmap:             data.roadmap,
        deployment:          data.deployment,
        scalingIdeas:        data.scalingIdeas,
        futureImprovements:  data.futureImprovements,
        targetCompanies:     data.targetCompanies,
        providerMeta:        data.providerMeta,
        inputProfile:        data.inputProfile,
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
