import { Hono } from "hono";
import { generatePreviews, generateDetail } from "../data/llmChain.js";
import { GenerateInputSchema, DetailInputSchema } from "../schemas.js";
import { PROVIDER_KEYS } from "../utils.js";
import type { GeneratePreviewsResponse, GenerateDetailResponse, ApiError } from "@frontier/shared";

export const generateRouter = new Hono()
  .post("/previews", async (c) => {
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
  .post("/detail", async (c) => {
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
  .post("/", async (c) => {
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
  });
