import { Hono } from "hono";
import { TRENDS_DATA } from "../data/trends.js";

export const trendsRouter = new Hono()
  .get("/", (c) => {
    const category = c.req.query("category")?.trim() ?? "";
    const momentum = c.req.query("momentum")?.trim() ?? "";

    let filtered = TRENDS_DATA;
    if (category) {
      const q = category.toLowerCase();
      filtered = filtered.filter((t) => t.category.toLowerCase().includes(q));
    }
    if (momentum) {
      filtered = filtered.filter((t) => t.momentum === momentum);
    }
    return c.json({ trends: filtered }, 200);
  });
