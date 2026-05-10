/**
 * Free public API enrichment — GitHub, Hacker News, arXiv/Semantic Scholar.
 * All results are cached server-side (6–24 hours) to avoid rate limits.
 * No API keys required for HN + arXiv. GitHub token is optional.
 */

// ─── Cache ────────────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  ts: number;
  ttl: number; // ms
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const e = cache.get(key) as CacheEntry<T> | undefined;
  if (!e) return null;
  if (Date.now() - e.ts > e.ttl) { cache.delete(key); return null; }
  return e.data;
}

function setCached<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, ts: Date.now(), ttl: ttlMs });
}

const SIX_HOURS  = 6  * 60 * 60 * 1000;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const TWENTY_FOUR  = 24 * 60 * 60 * 1000;

// ─── GitHub ───────────────────────────────────────────────────────────────────

export interface GitHubSignal {
  trendingRepos: string[];   // "owner/repo — description"
  popularTools: string[];    // tool names derived from starred repos
}

export async function fetchGitHubSignals(
  topics: string[],
  token?: string
): Promise<GitHubSignal> {
  const cacheKey = `gh:${topics.sort().join(",")}`;
  const cached = getCached<GitHubSignal>(cacheKey);
  if (cached) { console.log("[Enrichment] GitHub cache hit"); return cached; }

  const results: string[] = [];
  const tools: Set<string> = new Set();
  const headers: Record<string, string> = { "User-Agent": "frontier-ai/1.0" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Query at most 3 topics to stay well under rate limit
  for (const topic of topics.slice(0, 3)) {
    try {
      const q = encodeURIComponent(`topic:${topic.toLowerCase().replace(/\s+/g, "-")} stars:>200`);
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${q}&sort=stars&per_page=5`,
        { headers, signal: AbortSignal.timeout(5000) }
      );
      if (!res.ok) { console.warn(`[Enrichment] GitHub ${topic}: HTTP ${res.status}`); continue; }
      const data = await res.json() as { items?: { full_name: string; description: string; language: string }[] };
      for (const repo of (data.items ?? []).slice(0, 5)) {
        results.push(`${repo.full_name}${repo.description ? " — " + repo.description.slice(0, 80) : ""}`);
        if (repo.language) tools.add(repo.language);
      }
    } catch (e: any) {
      console.warn(`[Enrichment] GitHub topic "${topic}" failed: ${e.message}`);
    }
  }

  const signal: GitHubSignal = { trendingRepos: results.slice(0, 10), popularTools: [...tools].slice(0, 8) };
  setCached(cacheKey, signal, TWELVE_HOURS);
  return signal;
}

// ─── Hacker News ──────────────────────────────────────────────────────────────

export interface HNSignal {
  hotTopics: string[]; // titles of recent Ask HN / Show HN posts
}

export async function fetchHackerNewsSignals(keywords: string[]): Promise<HNSignal> {
  const cacheKey = `hn:${keywords.sort().join(",")}`;
  const cached = getCached<HNSignal>(cacheKey);
  if (cached) { console.log("[Enrichment] HN cache hit"); return cached; }

  const topics: string[] = [];

  // Use Algolia HN search — free, no key
  for (const kw of keywords.slice(0, 3)) {
    try {
      const q = encodeURIComponent(kw);
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${q}&tags=story&hitsPerPage=5&numericFilters=created_at_i>${Math.floor(Date.now() / 1000) - 30 * 86400}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (!res.ok) continue;
      const data = await res.json() as { hits?: { title?: string }[] };
      for (const hit of data.hits ?? []) {
        if (hit.title && hit.title.length > 10) topics.push(hit.title.slice(0, 120));
      }
    } catch (e: any) {
      console.warn(`[Enrichment] HN "${kw}" failed: ${e.message}`);
    }
  }

  const signal: HNSignal = { hotTopics: [...new Set(topics)].slice(0, 10) };
  setCached(cacheKey, signal, SIX_HOURS);
  return signal;
}

// ─── arXiv ────────────────────────────────────────────────────────────────────

export interface ArxivSignal {
  recentPapers: string[]; // "Title (YYYY-MM)"
}

export async function fetchArxivSignals(queries: string[]): Promise<ArxivSignal> {
  const cacheKey = `arxiv:${queries.sort().join(",")}`;
  const cached = getCached<ArxivSignal>(cacheKey);
  if (cached) { console.log("[Enrichment] arXiv cache hit"); return cached; }

  const papers: string[] = [];

  for (const q of queries.slice(0, 2)) {
    try {
      const encoded = encodeURIComponent(q);
      const res = await fetch(
        `https://export.arxiv.org/api/query?search_query=all:${encoded}&sortBy=submittedDate&sortOrder=descending&max_results=5`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) continue;
      const xml = await res.text();
      // Quick regex extraction — avoids a DOM parser dependency
      const titleMatches = [...xml.matchAll(/<title>(?!arxiv)(.*?)<\/title>/gs)];
      const dateMatches  = [...xml.matchAll(/<published>([\d-]+)/g)];
      titleMatches.forEach((m, i) => {
        const title = m[1].trim().replace(/\s+/g, " ");
        const date  = (dateMatches[i]?.[1] ?? "").slice(0, 7);
        if (title && title.length > 5) papers.push(`${title}${date ? ` (${date})` : ""}`);
      });
    } catch (e: any) {
      console.warn(`[Enrichment] arXiv "${q}" failed: ${e.message}`);
    }
  }

  const signal: ArxivSignal = { recentPapers: [...new Set(papers)].slice(0, 8) };
  setCached(cacheKey, signal, TWENTY_FOUR);
  return signal;
}

// ─── Semantic Scholar ─────────────────────────────────────────────────────────

export interface ScholarSignal {
  influentialPapers: string[];
}

export async function fetchSemanticScholarSignals(
  query: string,
  apiKey?: string
): Promise<ScholarSignal> {
  const cacheKey = `ss:${query}`;
  const cached = getCached<ScholarSignal>(cacheKey);
  if (cached) { console.log("[Enrichment] Scholar cache hit"); return cached; }

  const headers: Record<string, string> = {};
  if (apiKey) headers["x-api-key"] = apiKey;

  const papers: string[] = [];
  try {
    const q = encodeURIComponent(query);
    const res = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=5&fields=title,year,citationCount`,
      { headers, signal: AbortSignal.timeout(6000) }
    );
    if (res.ok) {
      const data = await res.json() as { data?: { title?: string; year?: number; citationCount?: number }[] };
      for (const p of (data.data ?? []).slice(0, 5)) {
        if (p.title) papers.push(`${p.title}${p.year ? ` (${p.year})` : ""}`);
      }
    }
  } catch (e: any) {
    console.warn(`[Enrichment] Semantic Scholar "${query}" failed: ${e.message}`);
  }

  const signal: ScholarSignal = { influentialPapers: papers };
  setCached(cacheKey, signal, TWENTY_FOUR);
  return signal;
}

// ─── Aggregated enrichment ────────────────────────────────────────────────────

import { TRENDS_DATA } from "./trends";
import { COMPANIES_DATA } from "./companies";

export interface EnrichmentContext {
  github: GitHubSignal;
  hn: HNSignal;
  arxiv: ArxivSignal;
  scholar: ScholarSignal;
  internalSignals?: {
    trends: string[];
    companies: string[];
  };
}

export async function gatherEnrichment(
  domains: string[],
  interests: string[],
  companies: string[],
  opts: {
    githubToken?: string;
    semanticScholarKey?: string;
  } = {}
): Promise<EnrichmentContext> {
  // Run all fetches in parallel — each is individually fault-tolerant
  const keywords = [...domains, ...interests].slice(0, 5);
  const primaryQuery = domains.slice(0, 2).join(" ") || interests[0] || "machine learning";

  const [github, hn, arxiv, scholar] = await Promise.all([
    fetchGitHubSignals(domains, opts.githubToken).catch(() => ({ trendingRepos: [], popularTools: [] })),
    fetchHackerNewsSignals(keywords).catch(() => ({ hotTopics: [] })),
    fetchArxivSignals(domains.slice(0, 2)).catch(() => ({ recentPapers: [] })),
    fetchSemanticScholarSignals(primaryQuery, opts.semanticScholarKey).catch(() => ({ influentialPapers: [] })),
  ]);

  const matchedTrends = TRENDS_DATA
    .filter(t => domains.some(d => t.category.toLowerCase().includes(d.toLowerCase()) || t.tags.some(tag => tag.toLowerCase() === d.toLowerCase())))
    .map(t => `${t.title} - ${t.description}`);
  
  const matchedCompanies = COMPANIES_DATA
    .filter(c => companies.some(tc => c.name.toLowerCase() === tc.toLowerCase()))
    .map(c => `${c.name} (Focus: ${c.focus.join(", ")}): ${c.recentWork[0]}`);

  return { 
    github, hn, arxiv, scholar, 
    internalSignals: { trends: matchedTrends, companies: matchedCompanies }
  };
}

/** Format enrichment as a compact string block for LLM prompt injection */
export function formatEnrichmentForPrompt(ctx: EnrichmentContext): string {
  const lines: string[] = [];

  if (ctx.github.trendingRepos.length) {
    lines.push("TRENDING GITHUB REPOS:");
    ctx.github.trendingRepos.slice(0, 5).forEach(r => lines.push(`  • ${r}`));
  }
  if (ctx.hn.hotTopics.length) {
    lines.push("HACKER NEWS TECH DISCUSSIONS (past 30 days):");
    ctx.hn.hotTopics.slice(0, 5).forEach(t => lines.push(`  • ${t}`));
  }
  if (ctx.arxiv.recentPapers.length) {
    lines.push("RECENT arXiv PAPERS:");
    ctx.arxiv.recentPapers.slice(0, 4).forEach(p => lines.push(`  • ${p}`));
  }
  if (ctx.scholar.influentialPapers.length) {
    lines.push("INFLUENTIAL PAPERS (Semantic Scholar):");
    ctx.scholar.influentialPapers.slice(0, 3).forEach(p => lines.push(`  • ${p}`));
  }

  return lines.length ? lines.join("\n") : "(no enrichment data available)";
}
