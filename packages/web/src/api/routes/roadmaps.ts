import { Hono } from "hono";

export const roadmapsRouter = new Hono()
  .get("/", (c) => {
    const roadmaps = [
      {
        id: "ml-engineer",
        title: "ML Engineer Roadmap",
        description: "From ML fundamentals to production ML systems at top AI companies",
        targetCompanies: ["OpenAI", "DeepMind", "Anthropic", "NVIDIA"],
        duration: "6-12 months",
        difficulty: "Advanced",
        steps: [
          { phase: "Foundation",       duration: "4-6 weeks",  topics: ["Python ML stack", "Linear algebra", "Statistics", "PyTorch basics"] },
          { phase: "Core ML",          duration: "6-8 weeks",  topics: ["Supervised/unsupervised learning", "Deep learning", "CNNs/RNNs/Transformers", "Training dynamics"] },
          { phase: "LLMs & Gen AI",    duration: "6-8 weeks",  topics: ["Transformer architecture", "Pre-training", "Fine-tuning", "RLHF", "RAG systems"] },
          { phase: "MLOps",            duration: "4-6 weeks",  topics: ["Experiment tracking", "Model serving", "Monitoring", "Infrastructure"] },
          { phase: "Portfolio Projects",duration: "8-12 weeks", topics: ["End-to-end ML systems", "Open source contributions", "Research paper implementation"] },
          { phase: "Interview Prep",   duration: "4-6 weeks",  topics: ["ML system design", "Coding", "Research discussion", "Behavioral"] },
        ],
        resources: ["fast.ai", "CS231n", "Andrej Karpathy lectures", "HuggingFace course"],
      },
      {
        id: "ai-researcher",
        title: "AI Researcher Roadmap",
        description: "Path to publishing research and joining top AI labs",
        targetCompanies: ["DeepMind", "Anthropic", "OpenAI", "Meta AI"],
        duration: "12-24 months",
        difficulty: "Researcher",
        steps: [
          { phase: "Math Foundation",   duration: "8-10 weeks",  topics: ["Linear algebra", "Calculus", "Probability theory", "Information theory"] },
          { phase: "Deep Learning",     duration: "8-10 weeks",  topics: ["Backprop", "Optimization", "Architectures", "Training tricks"] },
          { phase: "Research Reading",  duration: "Ongoing",     topics: ["100 foundational papers", "arXiv daily reading", "Paper summaries", "Implementation practice"] },
          { phase: "Specialization",    duration: "12-16 weeks", topics: ["Pick 1-2 research areas", "Deep dive implementations", "Reproduce SOTA results"] },
          { phase: "Original Research", duration: "16-24 weeks", topics: ["Novel hypothesis", "Experiments", "Writing", "arXiv submission"] },
          { phase: "Community",         duration: "Ongoing",     topics: ["NeurIPS/ICML submissions", "Open source", "Blog posts", "Collaborations"] },
        ],
        resources: ["The Matrix Calculus You Need", "Deep Learning Book", "Distill.pub", "Papers With Code"],
      },
      {
        id: "ai-startup-founder",
        title: "AI Startup Founder Roadmap",
        description: "Build and launch an AI product from zero to YC-ready",
        targetCompanies: ["YC", "a16z", "Sequoia"],
        duration: "6-12 months",
        difficulty: "Advanced",
        steps: [
          { phase: "AI Literacy",  duration: "4-6 weeks",  topics: ["LLM APIs", "Prompt engineering", "Fine-tuning basics", "AI product design"] },
          { phase: "Ideation",     duration: "2-4 weeks",  topics: ["Problem identification", "Market research", "AI advantage analysis", "Validation interviews"] },
          { phase: "Build MVP",    duration: "6-8 weeks",  topics: ["Rapid prototyping", "AI integration", "Core UX", "User testing"] },
          { phase: "Launch",       duration: "2-4 weeks",  topics: ["ProductHunt", "Twitter/X", "Indie Hackers", "Early users"] },
          { phase: "Traction",     duration: "8-12 weeks", topics: ["PMF discovery", "Pricing", "Growth loops", "Metrics"] },
          { phase: "Fundraising",  duration: "4-8 weeks",  topics: ["YC application", "Pitch deck", "Investor outreach", "Due diligence"] },
        ],
        resources: ["YC Startup School", "Paul Graham Essays", "Lenny's Newsletter", "Indie Hackers"],
      },
    ];
    return c.json({ roadmaps }, 200);
  });
