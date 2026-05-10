/**
 * Local dynamic fallback generator.
 *
 * Rules:
 * - NEVER uses a static DEFAULT_PROJECTS list
 * - Synthesizes one unique project per domain × interest × company combo
 * - Always returns exactly 4 projects
 * - aiGenerated is ALWAYS false — caller must mark provider as "local-fallback"
 */

import type { ProjectPreview, GenerateInput } from "../../shared/types.js";

// ─── Template bank (high-quality domain×interest pairs) ──────────────────────
// Used as a boost when the user's selection matches. Extras are generated dynamically.

const TEMPLATE_BANK: Record<string, Partial<ProjectPreview>> = {
  "LLMs+Music": {
    title: "Lyric Semantic Encoder with Contrastive Pretraining",
    pitch: "Contrastively pretrain a sentence encoder on lyric-melody pairs so downstream music generators understand poetic intent, not just literal words.",
    researchBottleneck: "Existing music LLMs treat lyrics as flat text; none model the semantic gap between lyric emotion and melodic contour.",
    tags: ["LLMs", "Music AI", "Contrastive Learning", "Audio"],
    category: "Generative Audio",
  },
  "LLMs+Gaming": {
    title: "Procedural Quest Narrative Engine via Constrained LLM Decoding",
    pitch: "Use constrained beam search over a fine-tuned Mistral to generate coherent, lore-consistent game quests that never contradict the game state graph.",
    researchBottleneck: "Open-world narrative generation breaks consistency at scale; current LLMs hallucinate plot contradictions without hard state constraints.",
    tags: ["LLMs", "Gaming", "Constrained Decoding", "Procedural Generation"],
    category: "Game AI",
  },
  "Computer Vision+Sports": {
    title: "Biomechanical Pose Deviation Detector for Cricket Batting",
    pitch: "Train a 3D pose estimation + deviation classifier on high-speed cricket footage to flag micro-second technique errors before coaches spot them.",
    researchBottleneck: "Sports CV models lack sport-specific biomechanical priors; ViTPose misses fine-grained angular deviations in fast-motion swings.",
    tags: ["Computer Vision", "Sports", "Pose Estimation", "Biomechanics"],
    category: "Sports AI",
  },
  "Computer Vision+Music": {
    title: "Sheet Music to MIDI Transcription via Transformer OCR",
    pitch: "End-to-end vision transformer that reads handwritten sheet music images and emits structured MIDI with >95% note accuracy — beating Audiveris on handwritten scores.",
    researchBottleneck: "OMR (optical music recognition) for handwritten scores fails below 80% accuracy; no model jointly handles stave detection and symbol classification.",
    tags: ["Computer Vision", "Music AI", "Transformer", "OMR"],
    category: "Music AI",
  },
  "RAG Systems+Reading": {
    title: "Citation-Aware Multi-Hop RAG for Research Literature",
    pitch: "Build a RAG pipeline that traces citation chains across 50k papers to answer complex multi-hop questions with provenance-grounded answers.",
    researchBottleneck: "Standard RAG retrieves isolated chunks; it cannot reason across citation chains or resolve contradictions between citing and cited papers.",
    tags: ["RAG", "Research", "Multi-Hop QA", "Embeddings"],
    category: "Research AI",
  },
  "Agentic AI+Finance": {
    title: "Multi-Agent Macro Event Signal Extractor",
    pitch: "Orchestrate 5 specialized agents (news scraper, sentiment scorer, earnings parser, risk quantifier, portfolio rebalancer) that respond to macro events in under 60 seconds.",
    researchBottleneck: "Single-agent finance LLMs hallucinate numbers; no multi-agent framework integrates real-time news with structured earnings data and portfolio constraints.",
    tags: ["Agentic AI", "Finance", "Multi-Agent", "Real-Time"],
    category: "Finance AI",
  },
  "Generative AI+Art": {
    title: "Style-Consistent LoRA Adapter for Generative Art Brands",
    pitch: "Fine-tune a SDXL LoRA on 50–200 brand images so a designer can generate infinite on-brand assets without per-prompt engineering.",
    researchBottleneck: "Existing DreamBooth approaches overfit on small datasets; LoRA regularization techniques for brand consistency remain unstudied.",
    tags: ["Generative AI", "Diffusion Models", "LoRA", "Design"],
    category: "Generative Art",
  },
  "Voice AI+Podcasts": {
    title: "Multi-Speaker Dialogue Synthesis with Emotion-Conditioned TTS",
    pitch: "Pipeline that takes a topic, generates a research-backed multi-host script, then synthesizes distinct voices with prosody matching emotional context via ElevenLabs Turbo.",
    researchBottleneck: "Current podcast AI uses flat TTS; emotion conditioning from script sentiment to prosody variance is unsolved for multi-speaker synthesis.",
    tags: ["Voice AI", "Podcasts", "TTS", "Emotion Modeling"],
    category: "Voice AI",
  },
  "NLP+Finance": {
    title: "Earnings Call Sentiment Regime Classifier",
    pitch: "Fine-tune a DeBERTa-v3 on 10 years of S&P 500 earnings transcripts to classify management sentiment regime and predict 5-day post-call price drift.",
    researchBottleneck: "Generic sentiment models fail on finance-specific hedging language; domain-adapted models for earnings tone shift detection don't exist.",
    tags: ["NLP", "Finance", "Sentiment Analysis", "DeBERTa"],
    category: "Finance AI",
  },
  "Reinforcement Learning+Gaming": {
    title: "Self-Play Curriculum RL Agent for Real-Time Strategy Games",
    pitch: "Train an RL agent on a parameterized StarCraft II curriculum — starting from trivial maps and self-playing to emergent macro strategies without human demonstrations.",
    researchBottleneck: "Sparse reward in RTS games causes policy collapse; existing AlphaStar approaches require massive compute and human replay bootstrapping.",
    tags: ["Reinforcement Learning", "Gaming", "Self-Play", "Curriculum Learning"],
    category: "Game AI",
  },
  "Multimodal AI+Education": {
    title: "Diagram-to-Explanation Vision-Language Tutor",
    pitch: "Fine-tune LLaVA on 20k textbook diagram+explanation pairs to generate Socratic explanations from any STEM figure, outperforming GPT-4V on domain accuracy.",
    researchBottleneck: "General VLMs hallucinate domain-specific diagram labels; no model is fine-tuned on the diagram→Socratic explanation task.",
    tags: ["Multimodal AI", "Education", "VLM", "LLaVA"],
    category: "Education AI",
  },
  "AI Infra+Startups": {
    title: "Token Budget Controller Middleware for LLM APIs",
    pitch: "Build a proxy middleware that enforces per-user/team token budgets, routes to cheaper models when budget is low, and logs cost attribution — all in <5ms overhead.",
    researchBottleneck: "No open-source LLM gateway implements real-time budget enforcement with model routing fallback; cost attribution across shared API keys is unsolved.",
    tags: ["AI Infra", "Startups", "Cost Control", "LLM APIs"],
    category: "AI Infrastructure",
  },
  "Diffusion Models+Fashion": {
    title: "Virtual Try-On via Garment-Aware Inpainting Diffusion",
    pitch: "Condition SDXL inpainting on garment segmentation masks and body keypoints to generate photorealistic try-on images that preserve fabric texture and lighting.",
    researchBottleneck: "Existing try-on models warp garments with thin-plate spline artifacts; diffusion-based approaches that preserve texture under cloth wrinkle are rare.",
    tags: ["Diffusion Models", "Fashion", "Inpainting", "Computer Vision"],
    category: "Fashion AI",
  },
  "Time Series AI+Finance": {
    title: "Temporal Fusion Transformer for Crypto Volatility Forecasting",
    pitch: "Adapt TFT's interpretable attention to multi-asset crypto time series, adding on-chain volume signals as known future inputs to forecast 24h realized volatility.",
    researchBottleneck: "Standard TFT assumes stationary distributions; crypto non-stationarity breaks attention calibration and no model integrates on-chain signals.",
    tags: ["Time Series AI", "Finance", "TFT", "Crypto"],
    category: "Finance AI",
  },
  "Healthcare AI+Biology": {
    title: "Protein–Drug Interaction Predictor via Graph Attention Network",
    pitch: "Model protein-drug binding affinity as a heterogeneous graph (residue nodes + molecular bond edges) and train a GAT to predict IC50 values from structure alone.",
    researchBottleneck: "Sequence-only binding models miss 3D structural context; GAT approaches on heterogeneous protein-drug graphs are underexplored versus sequence baselines.",
    tags: ["Healthcare AI", "Biology", "Graph Neural Networks", "Drug Discovery"],
    category: "BioAI",
  },
};

// Normalize a domain+interest key for lookup (order-independent)
function templateKey(domain: string, interest: string): string {
  return `${domain}+${interest}`;
}

// ─── Score generator (deterministic per combo) ───────────────────────────────

function scoreFromString(s: string, offset: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return 78 + Math.abs((h + offset) % 20); // 78–97
}

// ─── Experience difficulty map ────────────────────────────────────────────────

const EXP_DIFFICULTY: Record<string, ProjectPreview["difficulty"]> = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
  Researcher: "Researcher",
};

// ─── Time → estimate conversion ───────────────────────────────────────────────

function timeToEstimate(commitment: string): string {
  const m: Record<string, string> = {
    "1 week": "1 week",
    "1 month": "3-4 weeks",
    "3 months": "8-10 weeks",
    "6 months": "20-24 weeks",
  };
  return m[commitment] ?? commitment;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateProjects(input: GenerateInput): ProjectPreview[] {
  const domains   = input.domains.length   > 0 ? input.domains   : ["Machine Learning"];
  const interests = input.interests.length > 0 ? input.interests : ["Technology"];
  const companies = input.companies.length > 0 ? input.companies : ["OpenAI", "DeepMind", "Anthropic", "Mistral"];

  const difficulty = EXP_DIFFICULTY[input.experience] ?? "Intermediate";
  const timeEst    = timeToEstimate(input.timeCommitment);
  const goal       = input.goal;

  const researchLevel: ProjectPreview["researchLevel"] =
    goal === "Internship" ? "Internship"
    : goal === "Research" ? "Research"
    : goal === "Startup"  ? "Startup"
    : "Research";

  const seen  = new Set<string>();
  const results: ProjectPreview[] = [];

  // Helper: push if not duplicate, up to 6
  const push = (p: ProjectPreview) => {
    if (results.length >= 6) return;
    if (seen.has(p.id)) return;
    seen.add(p.id);
    results.push(p);
  };

  // ── Phase 1: Template matches ─────────────────────────────────────────────
  for (const domain of domains) {
    for (const interest of interests) {
      if (results.length >= 6) break;
      const key1 = templateKey(domain, interest);
      const key2 = templateKey(interest, domain);
      const tpl  = TEMPLATE_BANK[key1] ?? TEMPLATE_BANK[key2];
      if (!tpl) continue;

      const comboStr   = `${domain}-${interest}`;
      const company    = companies[results.length % companies.length];
      const id         = `tpl-${comboStr.toLowerCase().replace(/[\s+]/g, "-")}-${results.length}`;

      push({
        id,
        title:              tpl.title ?? `${domain} × ${interest} System`,
        pitch:              tpl.pitch ?? `A ${difficulty.toLowerCase()}-level project combining ${domain} and ${interest}.`,
        researchBottleneck: tpl.researchBottleneck ?? `Core challenge at the intersection of ${domain} and ${interest}.`,
        tags:               tpl.tags ?? [domain, interest, "AI"],
        category:           tpl.category ?? domain,
        difficulty,
        timeEstimate:       timeEst,
        researchLevel,
        originalityScore:   scoreFromString(comboStr, 7),
        recruiterScore:     scoreFromString(comboStr, 13),
        startupScore:       scoreFromString(comboStr, 19),
        publishabilityScore:scoreFromString(comboStr, 31),
        targetCompanies:    [company, companies[(results.length + 1) % companies.length]].filter((v, i, a) => a.indexOf(v) === i),
      });
    }
    if (results.length >= 6) break;
  }

  // ── Phase 2: Dynamic combos for remaining slots ───────────────────────────
  // One project per domain × interest × company intersection, never repeated

  const architectureSnippets: Record<string, string> = {
    "LLMs":                "Fine-tuned transformer → Retrieval-augmented context → Structured output parser",
    "Computer Vision":     "ViT backbone → FPN neck → Task-specific head (detection/segmentation/classification)",
    "Agentic AI":          "Orchestrator LLM → Tool-calling sub-agents → State machine → Synthesis layer",
    "Generative AI":       "Diffusion backbone (SDXL/DiT) → LoRA adapters → Conditioned inference API",
    "Reinforcement Learning": "Policy network (PPO/SAC) → Reward shaper → Environment interface → Eval suite",
    "RAG Systems":         "Document chunker → Embedding pipeline (text-embedding-3-large) → Vector DB → LLM re-ranker",
    "Voice AI":            "Speech encoder (Whisper) → Semantic token predictor → Neural vocoder (HiFi-GAN)",
    "Multimodal AI":       "Vision encoder (CLIP/DINOv2) + Text encoder → Cross-attention fusion → Task decoder",
    "NLP":                 "Tokenizer → Pre-trained LM backbone (DeBERTa/Llama) → Task head → RLHF alignment",
    "Time Series AI":      "Feature engineering → Temporal attention (TFT/PatchTST) → Calibrated probabilistic forecast",
    "Healthcare AI":       "Domain-specific data pipeline → Fine-tuned bio-LM (BioGPT/PubMedBERT) → Clinical evaluator",
    "Diffusion Models":    "Latent encoder → DiT/UNet denoiser → Classifier-free guidance → Decoder",
    "AI Infra":            "Request router → Model registry → Cost tracker → Observability dashboard",
  };

  const datasetHints: Record<string, string[]> = {
    "Music":     ["MAESTRO v3.0", "MSD (Million Song Dataset)", "FMA"],
    "Gaming":    ["OpenAI Gym", "Atari-HEAD", "MineRL"],
    "Sports":    ["SoccerNet", "SportsMOT", "PoseTrack"],
    "Reading":   ["arXiv bulk dump", "Semantic Scholar Open Research Corpus"],
    "Finance":   ["WRDS CRSP", "Yahoo Finance API", "Kaggle financial news datasets"],
    "Art":       ["LAION-Aesthetics", "WikiArt", "DiffusionDB"],
    "Podcasts":  ["Spotify Podcast Dataset", "Common Voice 13"],
    "Biology":   ["UniProt", "PDB (Protein Data Bank)", "ChEMBL"],
    "Education": ["Textbook Q&A datasets", "MIT OpenCourseWare"],
    "Fashion":   ["DeepFashion2", "iMaterialist Challenge"],
  };

  outer:
  for (const domain of domains) {
    for (const interest of interests) {
      if (results.length >= 6) break outer;

      const comboId = `dyn-${domain.replace(/\s+/g, "-").toLowerCase()}-${interest.replace(/\s+/g, "-").toLowerCase()}-${results.length}`;
      if (seen.has(comboId)) continue;

      const company   = companies[results.length % companies.length];
      const company2  = companies[(results.length + 1) % companies.length];
      const arch      = architectureSnippets[domain] ?? `${domain} pipeline → Model → Inference API → UI`;
      const datasets  = datasetHints[interest] ?? [`${interest}-specific public dataset`, "HuggingFace Hub", "Custom web scrape"];
      const comboStr  = `${domain}-${interest}`;

      push({
        id:               comboId,
        title:            `${domain} System for ${interest} Context — ${company} Stack`,
        pitch:            `A ${difficulty.toLowerCase()}-level ${domain} project that applies ${interest.toLowerCase()} domain signals to solve a concrete problem relevant to ${company}.`,
        researchBottleneck: `No existing ${domain} system integrates ${interest.toLowerCase()} priors at scale; this gap is the core technical contribution.`,
        tags:             [domain, interest, "AI", goal],
        category:         domain,
        difficulty,
        timeEstimate:     timeEst,
        researchLevel,
        originalityScore:    scoreFromString(comboStr, 11),
        recruiterScore:      scoreFromString(comboStr, 17),
        startupScore:        scoreFromString(comboStr, 23),
        publishabilityScore: scoreFromString(comboStr, 37),
        targetCompanies:  [company, company2].filter((v, i, a) => a.indexOf(v) === i),
      });

      // Suppress unused variable warning for arch/datasets (used in full detail generation only)
      void arch; void datasets;
    }
  }

  // ── Phase 3: If somehow still under 6, synthesize from domains alone ──────
  for (let di = 0; results.length < 6; di++) {
    const domain  = domains[di % domains.length];
    const company = companies[results.length % companies.length];
    const id      = `fill-${domain.replace(/\s+/g, "-").toLowerCase()}-${results.length}`;
    if (seen.has(id)) { if (di > domains.length * 6) break; continue; }

    push({
      id,
      title:            `${domain} Research Platform — ${company}-Ready`,
      pitch:            `An end-to-end ${domain} system designed to ${goal === "Startup" ? "ship as a product" : "publish as research"}, targeting ${company}.`,
      researchBottleneck: `Existing ${domain} solutions are either too generic or require proprietary data; this bridges the gap with open-weight models.`,
      tags:             [domain, "AI", "Research", company],
      category:         domain,
      difficulty,
      timeEstimate:     timeEst,
      researchLevel,
      originalityScore:    scoreFromString(`${domain}-fill-${di}`, 3),
      recruiterScore:      scoreFromString(`${domain}-fill-${di}`, 9),
      startupScore:        scoreFromString(`${domain}-fill-${di}`, 15),
      publishabilityScore: scoreFromString(`${domain}-fill-${di}`, 27),
      targetCompanies:  [company],
    });
  }

  return results.slice(0, 6);
}
