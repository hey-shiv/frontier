import { Hono } from "hono";
import { COMPANIES_DATA } from "../data/companies.js";
import type { ApiError } from "@frontier/shared";

export const companiesRouter = new Hono()
  .get("/", (c) => {
    const search = c.req.query("search")?.trim() ?? "";
    const focus  = c.req.query("focus")?.trim() ?? "";

    let filtered = COMPANIES_DATA;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (co) => co.name.toLowerCase().includes(q) || co.tagline.toLowerCase().includes(q)
      );
    }
    if (focus) {
      const q = focus.toLowerCase();
      filtered = filtered.filter((co) => co.focus.some((f) => f.toLowerCase().includes(q)));
    }
    return c.json({ companies: filtered }, 200);
  })
  .get("/:slug", (c) => {
    const slug = c.req.param("slug");
    const company = COMPANIES_DATA.find((co) => co.slug === slug);
    if (!company) return c.json({ error: "Not found" } satisfies ApiError, 404);
    return c.json({ company }, 200);
  });
