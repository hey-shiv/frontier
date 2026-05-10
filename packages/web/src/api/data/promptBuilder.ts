/**
 * Shared prompt builder — used by all LLM providers (Gemini, Groq, OpenRouter).
 * Single source of truth for the generation prompt so all providers get identical instructions.
 */
import type { GenerateInput } from "../../shared/types.js";
import { formatEnrichmentForPrompt } from "./enrichment.js";
import type { EnrichmentContext } from "./enrichment.js";

export const PREVIEW_SYSTEM_PROMPT = `You are an elite AI research director with deep knowledge of cutting-edge ML systems.
Your job: generate exactly 6 highly specific, unique, technically impressive project ideas.
Output ONLY a valid JSON array. No markdown fences, no prose, no explanation.`;

export function buildPreviewUserPrompt(input: GenerateInput, enrichment?: EnrichmentContext): string {
  const { domains, interests, companies, experience, goal, timeCommitment, seed } = input;

  // Build pairwise domain × interest combos, assign one per project
  const allCombos = domains.flatMap(d =>
    (interests.length > 0 ? interests : ["Technology"]).map(i => `${d} × ${i}`)
  );
  const assigned = [0, 1, 2, 3, 4, 5].map(i => allCombos[i % Math.max(allCombos.length, 1)]);

  // Ensure unique combos — if we have fewer than 6 distinct pairs, rotate companies
  const companiesList = companies.length > 0 ? companies : ["OpenAI", "DeepMind", "Anthropic", "Mistral"];

  const enrichmentBlock = enrichment ? formatEnrichmentForPrompt(enrichment) : "";

  return `Variation seed: ${seed ?? Date.now()} — produce output that differs noticeably from any previous call.

Generate EXACTLY 6 project PREVIEWS for a ${experience}-level developer.

== USER PROFILE ==
Goal: ${goal}
Time available: ${timeCommitment}
Domains: ${domains.join(", ")}
Interests: ${interests.join(", ") || "general technology"}
Target companies: ${companiesList.join(", ")}

== REQUIRED DOMAIN × INTEREST INTERSECTIONS (assign one per project) ==
Project 1: ${assigned[0]}
Project 2: ${assigned[1]}
Project 3: ${assigned[2]}
Project 4: ${assigned[3]}
Project 5: ${assigned[4]}
Project 6: ${assigned[5]}

${enrichmentBlock ? "== CURRENT TECH SIGNALS (use to inspire specific choices) ==\\n" + enrichmentBlock + "\\n" : ""}
== STRICT RULES ==
- Return ONLY a JSON array of exactly 6 objects — no markdown, no prose
- Each project MUST use a different primary domain from the list
- Each project MUST be relevant to at least one of the target companies
- Titles MUST name a specific architecture, technique, or model (not generic phrases)
- NEVER include: generic chatbots, CRUD apps, portfolio optimizers, paper explainers, interview prep bots, generic search engines — unless the user's inputs SPECIFICALLY justify them
- Scores MUST differ between projects (no two projects with identical score rows)
- The "id" field must be a unique kebab-case slug derived from the title

Return ONLY this JSON array:
[
  {
    "id": "unique-kebab-slug",
    "title": "Specific title naming an exact architecture or technique",
    "pitch": "One sharp sentence: what it does + the key technical innovation",
    "researchBottleneck": "The exact unsolved problem this tackles (1 sentence, name existing models/papers)",
    "tags": ["tag1", "tag2", "tag3", "tag4"],
    "category": "e.g. Generative Audio",
    "difficulty": "${experience === "Beginner" ? "Beginner" : experience === "Researcher" ? "Advanced" : "Intermediate"}",
    "timeEstimate": "realistic estimate within ${timeCommitment}",
    "researchLevel": "${goal === "Internship" ? "Internship" : goal === "Research" ? "Research" : goal === "Startup" ? "Startup" : "Research"}",
    "originalityScore": <integer 80-99>,
    "recruiterScore": <integer 75-99>,
    "startupScore": <integer 65-99>,
    "publishabilityScore": <integer 65-99>,
    "targetCompanies": ["1-2 from the target companies list"]
  }
]`;
}

export const DEEP_SYSTEM_PROMPT = `You are an elite AI research engineer. Write a research-grade project blueprint.
Output ONLY a valid JSON object. No markdown fences, no prose, no code fences.
Use exact architectures, loss functions, dataset names, and evaluation metrics.`;

export function buildDeepUserPrompt(
  preview: { id: string; title: string; pitch: string; researchBottleneck: string; category: string; targetCompanies: string[] },
  input: GenerateInput
): string {
  const { domains, interests, companies, experience, goal, timeCommitment } = input;
  return `Generate a DEEP TECHNICAL BLUEPRINT for this specific project:

Title: "${preview.title}"
Pitch: "${preview.pitch}"
Research bottleneck: "${preview.researchBottleneck}"
Category: ${preview.category}

User context:
- Domains: ${domains.join(", ")}
- Interests: ${interests.join(", ") || "general"}
- Target companies: ${companies.join(", ") || preview.targetCompanies.join(", ")}
- Experience: ${experience} | Goal: ${goal} | Time: ${timeCommitment}

Return ONLY this JSON object:
{
  "problemStatement": "2 sentences: specific research problem, cite limitations of existing models by name",
  "whyItMatters": "2 sentences: who needs this, why now",
  "coreInnovation": "The ONE novel technical contribution that makes this different from prior work",
  "architecture": "SPECIFIC: ComponentA (e.g. EnCodec tokenizer) → ComponentB (e.g. Latent DiT) → ComponentC (decoder). Name exact loss functions.",
  "requiredSkills": ["PyTorch", "specific skill 2", "specific skill 3", "specific skill 4"],
  "techStack": ["PyTorch", "lib1", "lib2", "lib3", "lib4", "lib5"],
  "recommendedModels": ["exact/model-name-1", "exact/model-name-2", "exact/model-name-3"],
  "datasets": ["EXACT Dataset 1 (e.g. MAESTRO v3.0)", "EXACT Dataset 2", "EXACT Dataset 3"],
  "apis": ["Exact API 1", "Exact API 2", "Exact API 3"],
  "evaluationMetrics": ["Metric 1 (e.g. Fréchet Audio Distance)", "Metric 2", "Metric 3"],
  "roadmap": [
    "Week 1-2: specific milestone with deliverable",
    "Week 3-4: specific milestone with deliverable",
    "Week 5-6: specific milestone with deliverable",
    "Week 7-8: specific milestone with deliverable"
  ],
  "deployment": "Specific stack + hosting + serving strategy",
  "scalingIdeas": ["Concrete scaling idea 1", "Concrete scaling idea 2"],
  "futureImprovements": ["Research direction 1", "Direction 2", "Direction 3"]
}

Be maximally specific. Name exact architectures, loss functions, datasets, metrics. No generic advice.`;
}
