import { Hono } from "hono";
import { cors } from "hono/cors";
import { PROVIDER_KEYS } from "./utils.js";
import { companiesRouter } from "./routes/companies.js";
import { trendsRouter } from "./routes/trends.js";
import { generateRouter } from "./routes/generate.js";
import { projectsRouter } from "./routes/projects.js";
import { roadmapsRouter } from "./routes/roadmaps.js";

// Log which providers are available (never log key values)
console.log("[Frontier] LLM provider availability:");
console.log("  Gemini:",          PROVIDER_KEYS.geminiKey     ? "✓ present" : "✗ missing");
console.log("  Groq:",            PROVIDER_KEYS.groqKey       ? "✓ present" : "✗ missing");
console.log("  OpenRouter 1:",    PROVIDER_KEYS.openrouterKey ? "✓ present" : "✗ missing");
console.log("  OpenRouter 2:",    PROVIDER_KEYS.openrouterKey2 ? "✓ present" : "✗ missing");
console.log("  GitHub token:",    PROVIDER_KEYS.githubToken   ? "✓ present" : "✗ optional");
console.log("  Semantic Scholar:",PROVIDER_KEYS.semanticScholarKey ? "✓ present" : "✗ optional");

const app = new Hono()
  .basePath("api")
  .use(cors({ origin: "*" }))
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .route("/companies", companiesRouter)
  .route("/trends", trendsRouter)
  .route("/generate", generateRouter)
  .route("/projects", projectsRouter)
  .route("/roadmaps", roadmapsRouter);

export type AppType = typeof app;
export default app;
