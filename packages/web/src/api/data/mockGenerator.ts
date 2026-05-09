export interface ProjectRecommendation {
  id: string;
  title: string;
  pitch: string;
  originalityScore: number;
  recruiterScore: number;
  startupScore: number;
  difficulty: string;
  timeEstimate: string;
  architecture: string;
  roadmap: string[];
  datasets: string[];
  apis: string[];
  deployment: string;
  tags: string[];
  targetCompanies: string[];
  category: string;
  futureImprovements: string[];
}

interface GenerateInput {
  domains: string[];
  interests: string[];
  companies: string[];
  experience: string;
  goal: string;
  timeCommitment: string;
}

const PROJECT_TEMPLATES: Record<string, ProjectRecommendation[]> = {
  "LLMs+Music": [
    {
      id: "llm-music-1",
      title: "Lyric Intelligence Engine",
      pitch: "An LLM-powered system that analyzes song lyrics semantically and generates contextually matched music prompts for AI music models",
      originalityScore: 91,
      recruiterScore: 88,
      startupScore: 85,
      difficulty: "Intermediate",
      timeEstimate: "4-6 weeks",
      architecture: "FastAPI backend → LLM lyric analyzer → Music generation pipeline (Suno/MusicGen) → React frontend with audio player",
      roadmap: [
        "Week 1: Scrape & clean lyric dataset (Genius API), build embedding pipeline",
        "Week 2: Fine-tune sentiment/mood classifier on lyrics",
        "Week 3: Build prompt generation layer connecting mood to music descriptors",
        "Week 4: Integrate Suno/MusicGen API for audio generation",
        "Week 5: Build React UI with playlist management",
        "Week 6: Deploy on Railway + optimize latency",
      ],
      datasets: ["Genius Lyrics API", "MSD (Million Song Dataset)", "AudioSet", "FMA (Free Music Archive)"],
      apis: ["OpenAI GPT-4o", "Suno API", "MusicGen (HuggingFace)", "Genius API"],
      deployment: "Railway (FastAPI) + Vercel (Frontend) + S3 (audio storage)",
      tags: ["LLMs", "Music AI", "Generative AI", "Audio"],
      targetCompanies: ["Suno", "ElevenLabs", "OpenAI"],
      category: "Creative AI",
      futureImprovements: [
        "Real-time streaming generation",
        "User feedback loop for personalization",
        "Multi-track composition support",
      ],
    },
  ],
  "Agentic AI+Gaming": [
    {
      id: "agent-gaming-1",
      title: "AutoPlay Agent: Self-Learning Game AI",
      pitch: "A multi-agent reinforcement learning system that autonomously learns and masters any game using GPT-4 for planning + custom RL for execution",
      originalityScore: 94,
      recruiterScore: 92,
      startupScore: 78,
      difficulty: "Advanced",
      timeEstimate: "8-12 weeks",
      architecture: "GPT-4 strategic planner → RL policy network → Game environment interface → Performance tracking dashboard",
      roadmap: [
        "Week 1-2: Set up OpenAI Gym environments, baseline RL agents",
        "Week 3-4: Implement GPT-4 as high-level strategic planner",
        "Week 5-6: Train low-level RL policy with planner guidance",
        "Week 7-8: Build multi-agent competitive scenarios",
        "Week 9-10: Performance dashboard and replay system",
        "Week 11-12: Generalization testing across different games",
      ],
      datasets: ["OpenAI Gym", "Atari Learning Environment", "MineRL dataset"],
      apis: ["OpenAI GPT-4", "Weights & Biases", "Ray RLlib"],
      deployment: "AWS EC2 GPU instances + W&B for experiment tracking",
      tags: ["Agentic AI", "Reinforcement Learning", "Gaming", "Multi-Agent"],
      targetCompanies: ["DeepMind", "OpenAI"],
      category: "Agentic Systems",
      futureImprovements: [
        "Transfer learning across game domains",
        "Human-AI collaborative gameplay",
        "Real-time commentary generation",
      ],
    },
  ],
  "Computer Vision+Sports": [
    {
      id: "cv-sports-1",
      title: "SportVision Analytics Platform",
      pitch: "Real-time computer vision system that tracks player movements, analyzes tactics, and generates AI commentary for cricket/football matches",
      originalityScore: 89,
      recruiterScore: 93,
      startupScore: 91,
      difficulty: "Advanced",
      timeEstimate: "10-14 weeks",
      architecture: "YOLOv9 player tracking → DeepSORT for re-identification → Pose estimation → LLM commentary generator → Dashboard",
      roadmap: [
        "Week 1-2: Collect and label sports video dataset",
        "Week 3-4: Train YOLOv9 for player/ball detection",
        "Week 5-6: Implement DeepSORT tracking + player re-ID",
        "Week 7-8: Pose estimation for action recognition",
        "Week 9-10: Tactical analysis algorithms (formations, heatmaps)",
        "Week 11-12: GPT-4 commentary generation pipeline",
        "Week 13-14: Dashboard with real-time video overlay",
      ],
      datasets: ["SoccerNet", "SportsMOT", "PoseTrack", "Cricket video datasets"],
      apis: ["OpenAI GPT-4", "Roboflow", "AWS Rekognition"],
      deployment: "AWS + Docker + RTMP streaming for live video",
      tags: ["Computer Vision", "Sports", "Tracking", "Analytics"],
      targetCompanies: ["NVIDIA", "DeepMind"],
      category: "Computer Vision",
      futureImprovements: [
        "Live match streaming integration",
        "Player performance prediction",
        "Multi-camera angle fusion",
      ],
    },
  ],
  "RAG Systems+Reading": [
    {
      id: "rag-reading-1",
      title: "DeepRead: AI Research Copilot",
      pitch: "An advanced RAG system that ingests your entire reading list — books, papers, articles — and lets you have deep conversations with your knowledge base",
      originalityScore: 87,
      recruiterScore: 90,
      startupScore: 88,
      difficulty: "Intermediate",
      timeEstimate: "5-7 weeks",
      architecture: "Document ingestion pipeline → Chunking + embeddings → Pinecone vector DB → Hybrid search → GPT-4 with citations → Chat UI",
      roadmap: [
        "Week 1: PDF/EPUB ingestion, chunking strategies",
        "Week 2: Embedding pipeline + Pinecone setup",
        "Week 3: Hybrid retrieval (semantic + keyword)",
        "Week 4: Citation-aware GPT-4 prompting",
        "Week 5: Cross-document synthesis queries",
        "Week 6: Chat UI with source highlighting",
        "Week 7: User library management + export",
      ],
      datasets: ["Project Gutenberg", "arXiv", "Wikipedia dumps"],
      apis: ["OpenAI Embeddings + GPT-4", "Pinecone", "LlamaIndex"],
      deployment: "Railway + Vercel + Pinecone cloud",
      tags: ["RAG", "LLMs", "Reading", "Knowledge Management"],
      targetCompanies: ["Perplexity", "OpenAI", "Anthropic"],
      category: "RAG Systems",
      futureImprovements: [
        "Multi-user knowledge sharing",
        "Automatic reading recommendations",
        "Graph-based concept linking",
      ],
    },
  ],
  "Voice AI+Podcasts": [
    {
      id: "voice-podcast-1",
      title: "PodcastForge AI",
      pitch: "Fully automated podcast generation system — input a topic, get a research-backed multi-host podcast with realistic voices, sound effects, and distribution",
      originalityScore: 93,
      recruiterScore: 91,
      startupScore: 94,
      difficulty: "Intermediate",
      timeEstimate: "6-8 weeks",
      architecture: "Topic research agent → Script generator → ElevenLabs multi-voice TTS → Audio mixing pipeline → Auto-distribution",
      roadmap: [
        "Week 1: Research agent with web scraping + summarization",
        "Week 2: Multi-host script generation with GPT-4",
        "Week 3: ElevenLabs voice synthesis + voice cloning",
        "Week 4: Audio mixing with background music + effects",
        "Week 5: Quality review pipeline",
        "Week 6: Auto-upload to Spotify/Apple Podcasts",
        "Week 7-8: Subscriber personalization system",
      ],
      datasets: ["Podcast transcripts (Spotify API)", "Common Voice", "AudioSet"],
      apis: ["ElevenLabs API", "OpenAI GPT-4", "Spotify API", "RSS generation"],
      deployment: "Railway + S3 audio storage + Cloudflare CDN",
      tags: ["Voice AI", "Podcasts", "LLMs", "Audio Production"],
      targetCompanies: ["ElevenLabs", "OpenAI", "Suno"],
      category: "Voice AI",
      futureImprovements: [
        "Real guest interview simulation",
        "Live podcast generation",
        "Listener Q&A integration",
      ],
    },
  ],
  "Generative AI+Art": [
    {
      id: "gen-art-1",
      title: "StyleSync: Personal Brand AI",
      pitch: "Train a personalized diffusion model on your design style and generate on-brand visuals, logos, and marketing assets automatically",
      originalityScore: 88,
      recruiterScore: 85,
      startupScore: 92,
      difficulty: "Advanced",
      timeEstimate: "8-10 weeks",
      architecture: "DreamBooth fine-tuning pipeline → LoRA training → Inference API → Brand asset manager → React UI",
      roadmap: [
        "Week 1-2: Data collection pipeline + augmentation",
        "Week 3-4: DreamBooth + LoRA fine-tuning on style",
        "Week 5-6: Inference optimization with TensorRT",
        "Week 7-8: Brand guidelines extraction from existing assets",
        "Week 9-10: UI for asset generation and management",
      ],
      datasets: ["LAION-5B subset", "User provided style images", "Unsplash API"],
      apis: ["HuggingFace Diffusers", "Replicate API", "DALL-E 3"],
      deployment: "Modal.com for GPU inference + Vercel frontend",
      tags: ["Generative AI", "Diffusion Models", "Fine-tuning", "Design"],
      targetCompanies: ["Runway", "Midjourney", "Stability AI"],
      category: "Generative AI",
      futureImprovements: [
        "Video style transfer",
        "Brand consistency scorer",
        "Team collaboration features",
      ],
    },
  ],
  "AI Agents+Startups": [
    {
      id: "agents-startup-1",
      title: "StartupGPT: Autonomous Business Validator",
      pitch: "Multi-agent system that automatically validates startup ideas — market research, competitor analysis, TAM calculation, and MVP scoping in minutes",
      originalityScore: 90,
      recruiterScore: 87,
      startupScore: 96,
      difficulty: "Intermediate",
      timeEstimate: "5-7 weeks",
      architecture: "Idea input → Research agent → Market analysis agent → Competitor scout agent → Financial modeling agent → Report generator",
      roadmap: [
        "Week 1: Orchestrator agent + task decomposition",
        "Week 2: Market research agent with web search tools",
        "Week 3: Competitor intelligence agent",
        "Week 4: TAM/SAM/SOM calculator agent",
        "Week 5: Report synthesis + visualization",
        "Week 6: Feedback loop + iteration agent",
        "Week 7: Web UI + sharing",
      ],
      datasets: ["Crunchbase public data", "ProductHunt API", "Google Trends API"],
      apis: ["OpenAI GPT-4", "Perplexity Sonar", "SerpAPI", "Crunchbase API"],
      deployment: "Railway + Vercel + Redis for agent state",
      tags: ["Agentic AI", "Startups", "Research", "Multi-Agent"],
      targetCompanies: ["Perplexity", "OpenAI", "Anthropic"],
      category: "Agentic Systems",
      futureImprovements: [
        "Pitch deck auto-generation",
        "Investor matching",
        "Continuous market monitoring",
      ],
    },
  ],
};

const DEFAULT_PROJECTS: ProjectRecommendation[] = [
  {
    id: "default-1",
    title: "Neural Search Engine",
    pitch: "A semantic search engine that understands intent, not just keywords — built on embeddings, vector search, and LLM re-ranking",
    originalityScore: 85,
    recruiterScore: 92,
    startupScore: 88,
    difficulty: "Intermediate",
    timeEstimate: "5-7 weeks",
    architecture: "Embedding pipeline → Pinecone/Weaviate → BM25 + semantic hybrid → LLM reranker → Search UI",
    roadmap: [
      "Week 1: Crawl & index target domain data",
      "Week 2: Embedding pipeline with text-embedding-3-large",
      "Week 3: Hybrid retrieval (BM25 + semantic)",
      "Week 4: LLM reranking + query expansion",
      "Week 5: Search UI with facets and filters",
      "Week 6-7: Evaluation metrics + A/B testing",
    ],
    datasets: ["Common Crawl", "Wikipedia", "Domain-specific crawl"],
    apis: ["OpenAI Embeddings", "Pinecone", "Cohere Rerank"],
    deployment: "Railway + Vercel + Pinecone",
    tags: ["AI Search", "RAG", "Embeddings", "Vector DB"],
    targetCompanies: ["Perplexity", "OpenAI"],
    category: "AI Search",
    futureImprovements: ["Personalization", "Multi-language support", "Real-time indexing"],
  },
  {
    id: "default-2",
    title: "AI Research Paper Explainer",
    pitch: "Paste any arXiv paper link and get a structured breakdown — key contributions, methodology, experiments, and implementation guide",
    originalityScore: 82,
    recruiterScore: 89,
    startupScore: 83,
    difficulty: "Beginner",
    timeEstimate: "2-3 weeks",
    architecture: "arXiv PDF scraper → LLM extraction → Structured summary → LaTeX renderer → Web UI",
    roadmap: [
      "Week 1: arXiv API integration + PDF parsing",
      "Week 2: Multi-stage LLM extraction prompts",
      "Week 3: UI with structured sections + related papers",
    ],
    datasets: ["arXiv API", "Semantic Scholar API"],
    apis: ["OpenAI GPT-4", "arXiv API", "Semantic Scholar"],
    deployment: "Vercel + Railway",
    tags: ["LLMs", "Research", "NLP", "Education"],
    targetCompanies: ["Perplexity", "Anthropic"],
    category: "Research Tools",
    futureImprovements: ["Citation graph visualization", "Implementation code generation", "Paper comparison"],
  },
  {
    id: "default-3",
    title: "AI-Powered Portfolio Optimizer",
    pitch: "Analyzes your GitHub, projects, and skills — then generates a personalized career positioning strategy with targeted project recommendations",
    originalityScore: 88,
    recruiterScore: 94,
    startupScore: 80,
    difficulty: "Intermediate",
    timeEstimate: "4-5 weeks",
    architecture: "GitHub API scraper → LLM project analyzer → Skill gap identifier → Recommendation engine → Career roadmap generator",
    roadmap: [
      "Week 1: GitHub API integration + project extraction",
      "Week 2: Skill extraction and gap analysis",
      "Week 3: Company JD scraping + matching",
      "Week 4: Personalized recommendation engine",
      "Week 5: Visual career roadmap UI",
    ],
    datasets: ["GitHub API", "LinkedIn job postings", "Glassdoor API"],
    apis: ["OpenAI GPT-4", "GitHub API", "Google Jobs API"],
    deployment: "Railway + Vercel",
    tags: ["LLMs", "Career", "Recommendation Systems"],
    targetCompanies: ["OpenAI", "Anthropic", "HuggingFace"],
    category: "Career AI",
    futureImprovements: ["Real-time job matching", "Interview prep agent", "Salary prediction"],
  },
];

export function generateProjects(input: GenerateInput): ProjectRecommendation[] {
  const results: ProjectRecommendation[] = [];
  const seen = new Set<string>();

  const expMultiplier =
    input.experience === "Researcher" ? 1.05 :
    input.experience === "Advanced" ? 1.0 :
    input.experience === "Intermediate" ? 0.95 : 0.90;

  // 1. Match domain × interest pairs from templates
  for (const domain of input.domains) {
    for (const interest of input.interests) {
      const key1 = `${domain}+${interest}`;
      const key2 = `${interest}+${domain}`;
      const matches = PROJECT_TEMPLATES[key1] || PROJECT_TEMPLATES[key2];
      if (matches) {
        for (const project of matches) {
          if (!seen.has(project.id) && results.length < 4) {
            seen.add(project.id);
            results.push({
              ...project,
              originalityScore: Math.min(99, Math.round(project.originalityScore * expMultiplier)),
              recruiterScore: Math.min(99, Math.round(project.recruiterScore * expMultiplier)),
              startupScore: Math.min(99, Math.round(project.startupScore * expMultiplier)),
            });
          }
        }
      }
    }
  }

  // 2. Domain-specific fallback projects
  const domainProjects = generateDomainProjects(input);
  for (const p of domainProjects) {
    if (!seen.has(p.id) && results.length < 4) {
      seen.add(p.id);
      results.push(p);
    }
  }

  // 3. If still under 4, synthesize one card per remaining domain × interest combo
  //    (completely dynamic — never uses DEFAULT_PROJECTS)
  const domains = input.domains.length > 0 ? input.domains : ["AI"];
  const interests = input.interests.length > 0 ? input.interests : ["Technology"];
  const companies = input.companies.length > 0 ? input.companies : ["OpenAI", "DeepMind"];

  for (const domain of domains) {
    for (const interest of interests) {
      if (results.length >= 4) break;
      const comboId = `dynamic-${domain.replace(/\s+/g, "-").toLowerCase()}-${interest.replace(/\s+/g, "-").toLowerCase()}`;
      if (seen.has(comboId)) continue;
      seen.add(comboId);
      const company = companies[results.length % companies.length];
      results.push({
        id: comboId,
        title: `${domain} × ${interest} Intelligence System`,
        pitch: `A ${input.experience.toLowerCase()}-level ${domain} project blending ${interest.toLowerCase()} context — built to stand out in ${company} applications`,
        originalityScore: Math.min(99, Math.round(84 * expMultiplier)),
        recruiterScore: Math.min(99, Math.round(87 * expMultiplier)),
        startupScore: Math.min(99, Math.round(81 * expMultiplier)),
        difficulty: input.experience === "Beginner" ? "Intermediate" : input.experience === "Researcher" ? "Advanced" : input.experience,
        timeEstimate: input.timeCommitment,
        architecture: `Data pipeline → ${domain} model → ${interest} context encoder → Inference API → UI`,
        roadmap: [
          "Week 1: Dataset collection and preprocessing",
          "Week 2: Baseline model implementation",
          "Week 3: Domain adaptation and fine-tuning",
          "Week 4: Evaluation, deployment, and documentation",
        ],
        datasets: [`${interest}-specific public dataset`, "HuggingFace Hub datasets", "Custom web scrape"],
        apis: ["OpenAI API", "HuggingFace Inference", `${company} API (if available)`],
        deployment: "Modal.com for inference + Vercel frontend",
        tags: [domain, interest, "AI", input.goal],
        targetCompanies: companies.slice(0, 2),
        category: domain,
        futureImprovements: [
          `Extend to other ${interest.toLowerCase()} sub-domains`,
          "Open-source the pipeline",
          "Build a public leaderboard",
        ],
      });
    }
    if (results.length >= 4) break;
  }

  return results.slice(0, 4);
}

function generateDomainProjects(input: GenerateInput): ProjectRecommendation[] {
  const projects: ProjectRecommendation[] = [];

  if (input.domains.includes("Agentic AI") || input.domains.includes("AI Agents")) {
    projects.push({
      id: "gen-agent-1",
      title: `${input.interests[0] || "Domain"} Intelligence Agent`,
      pitch: `Autonomous multi-agent system that researches, analyzes, and generates actionable insights in the ${input.interests[0] || "target"} domain using tool-calling LLMs`,
      originalityScore: 90,
      recruiterScore: 92,
      startupScore: 88,
      difficulty: input.experience === "Beginner" ? "Intermediate" : "Advanced",
      timeEstimate: input.timeCommitment === "1 week" ? "3-4 weeks" : `${input.timeCommitment}`,
      architecture: "Orchestrator LLM → Specialized sub-agents → Tool library (web search, code exec, APIs) → Synthesis layer → UI",
      roadmap: [
        "Setup multi-agent framework (LangGraph/AutoGen)",
        "Define agent roles and tool interfaces",
        "Implement specialized domain tools",
        "Build orchestration and state management",
        "Create output synthesis and visualization",
        "Deploy with monitoring",
      ],
      datasets: ["Domain-specific public datasets", "Web scraping pipeline", "API integrations"],
      apis: ["OpenAI GPT-4", "Anthropic Claude", "SerpAPI", "Domain APIs"],
      deployment: "Railway + Redis for agent state + Vercel UI",
      tags: ["Agentic AI", "Multi-Agent", "LLMs", input.interests[0] || "AI"],
      targetCompanies: input.companies.length > 0 ? input.companies : ["OpenAI", "Anthropic"],
      category: "Agentic Systems",
      futureImprovements: ["Self-improving agent loops", "Human-in-the-loop", "Agent marketplace"],
    });
  }

  if (input.domains.includes("Generative AI") || input.domains.includes("Diffusion Models")) {
    projects.push({
      id: "gen-diffusion-1",
      title: `${input.interests[0] || "Creative"} Diffusion Studio`,
      pitch: `Fine-tuned diffusion model specialized for ${input.interests[0] || "creative"} content generation with custom LoRA adapters and style control`,
      originalityScore: 87,
      recruiterScore: 84,
      startupScore: 91,
      difficulty: "Advanced",
      timeEstimate: "6-10 weeks",
      architecture: "Data collection → LoRA/DreamBooth fine-tuning → SDXL base → ControlNet integration → Generation UI",
      roadmap: [
        "Curate and clean training dataset",
        "Setup SDXL fine-tuning pipeline",
        "Train LoRA adapters on style",
        "Integrate ControlNet for guided generation",
        "Build prompt engineering toolkit",
        "Deploy on Modal/Replicate for GPU inference",
        "Build generation UI with presets",
      ],
      datasets: ["LAION subset", "Domain-specific images", "User uploads"],
      apis: ["HuggingFace Diffusers", "Replicate", "Modal.com"],
      deployment: "Modal.com GPU + Vercel frontend + S3 storage",
      tags: ["Diffusion Models", "Generative AI", "Fine-tuning", input.interests[0] || "Creative"],
      targetCompanies: input.companies.length > 0 ? input.companies : ["Runway", "Midjourney"],
      category: "Generative AI",
      futureImprovements: ["Video generation", "Style mixing", "API for developers"],
    });
  }

  if (input.domains.includes("NLP") || input.domains.includes("LLMs")) {
    const company = input.companies[0] || "target company";
    projects.push({
      id: "gen-nlp-1",
      title: `${company} Interview Prep AI Coach`,
      pitch: `Personalized AI system that simulates ${company} technical interviews with real question patterns, solution evaluation, and performance feedback`,
      originalityScore: 85,
      recruiterScore: 96,
      startupScore: 89,
      difficulty: input.experience === "Beginner" ? "Beginner" : "Intermediate",
      timeEstimate: "3-5 weeks",
      architecture: "Question bank → Difficulty classifier → LLM interviewer → Code execution sandbox → Performance evaluator → Feedback generator",
      roadmap: [
        "Scrape and categorize interview questions by company",
        "Build difficulty classification model",
        "Design multi-turn interview conversation flow",
        "Integrate code execution for coding rounds",
        "Build performance scoring rubric",
        "Create personalized feedback system",
        "UI with session history and progress tracking",
      ],
      datasets: ["LeetCode", "Glassdoor interview questions", "company engineering blogs"],
      apis: ["OpenAI GPT-4", "Code execution sandbox", "Embeddings for similarity"],
      deployment: "Railway + Vercel + PostgreSQL",
      tags: ["LLMs", "NLP", "Career", "Education"],
      targetCompanies: input.companies.length > 0 ? input.companies : ["OpenAI", "Anthropic"],
      category: "Career AI",
      futureImprovements: ["Video interview simulation", "Behavioral round prep", "Resume optimization"],
    });
  }

  return projects;
}
