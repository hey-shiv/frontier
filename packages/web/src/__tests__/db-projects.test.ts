import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { getDb, schema } from "@frontier/db";
import { eq } from "drizzle-orm";

describe("Database & Session scoped saved projects", () => {
  const testSession = "test-session-123";
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database is not configured for DB tests");
    await db.delete(schema.savedProjects).where(eq(schema.savedProjects.sessionId, testSession));
  });

  afterAll(async () => {
    await db.delete(schema.savedProjects).where(eq(schema.savedProjects.sessionId, testSession));
  });

  test("can save and retrieve project scoped to session", async () => {
    const [inserted] = await db.insert(schema.savedProjects).values({
      sessionId: testSession,
      title: "DB Test Project",
      pitch: "Testing DB ops",
      domains: [],
      interests: [],
      tags: ["DB"],
      category: "Test",
      difficulty: "Beginner",
      timeEstimate: "1 week",
      researchLevel: "Research",
      originalityScore: 80,
      recruiterScore: 80,
      startupScore: 80,
      publishabilityScore: 80,
      researchBottleneck: "N/A",
      problemStatement: "Test problem",
      whyItMatters: "Test reason",
      coreInnovation: "Test innovation",
      architecture: "Test arch",
      requiredSkills: [],
      techStack: [],
      recommendedModels: [],
      datasets: [],
      apis: [],
      evaluationMetrics: [],
      roadmap: ["Step 1"],
      deployment: "Test deploy",
      scalingIdeas: [],
      futureImprovements: [],
      targetCompanies: [],
      providerMeta: {},
      inputProfile: {}
    }).returning();

    expect(inserted).toBeDefined();
    expect(inserted.title).toBe("DB Test Project");

    const retrieved = await db.select().from(schema.savedProjects).where(eq(schema.savedProjects.sessionId, testSession));
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].sessionId).toBe(testSession);
    expect(retrieved[0].title).toBe("DB Test Project");

    const otherSession = await db.select().from(schema.savedProjects).where(eq(schema.savedProjects.sessionId, "other-session"));
    expect(otherSession.length).toBe(0); // Scoped retrieval works
  });

  test("can delete project", async () => {
    const retrieveBefore = await db.select().from(schema.savedProjects).where(eq(schema.savedProjects.sessionId, testSession));
    expect(retrieveBefore.length).toBeGreaterThan(0);

    const idToDelete = retrieveBefore[0].id;
    await db.delete(schema.savedProjects).where(eq(schema.savedProjects.id, idToDelete));

    const retrieveAfter = await db.select().from(schema.savedProjects).where(eq(schema.savedProjects.sessionId, testSession));
    expect(retrieveAfter.length).toBe(retrieveBefore.length - 1);
  });
});