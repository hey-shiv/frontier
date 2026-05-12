import { describe, expect, test } from "bun:test";
import { exportToMarkdown } from "../web/lib/export";
import type { SavedProject } from "@frontier/shared";

describe("Markdown Export", () => {
  test("formats a project correctly into Markdown", () => {
    const project: SavedProject = {
      id: 1,
      sessionId: "test",
      title: "Test AI Project",
      pitch: "A revolutionary AI system.",
      domains: ["AI"],
      interests: ["Open Source"],
      tags: ["Python", "AI"],
      category: "Generative AI",
      difficulty: "Advanced",
      timeEstimate: "3 weeks",
      researchLevel: "Startup",
      originalityScore: 90,
      recruiterScore: 85,
      startupScore: 95,
      publishabilityScore: 80,
      researchBottleneck: "Tokenization speed is too slow.",
      problemStatement: "Current tools lack speed.",
      whyItMatters: "Speeds up workflows by 10x.",
      coreInnovation: "Custom tokenizer in Rust.",
      architecture: "Python -> Rust FFI -> FastAPI",
      requiredSkills: ["Rust", "Python"],
      techStack: ["React", "FastAPI"],
      recommendedModels: ["Llama 3"],
      datasets: ["CommonCrawl"],
      apis: ["OpenAI API"],
      evaluationMetrics: ["Tokens/sec"],
      roadmap: ["Week 1: Rust core", "Week 2: Python wrapper"],
      deployment: "Docker on AWS",
      scalingIdeas: ["Deploy on GPU cluster"],
      futureImprovements: ["Add more models"],
      targetCompanies: ["OpenAI"],
      providerMeta: {},
      inputProfile: {},
      createdAt: new Date("2025-01-01T12:00:00Z"),
    };

    const md = exportToMarkdown(project);
    expect(md).toContain("# Test AI Project");
    expect(md).toContain("> **A revolutionary AI system.**");
    expect(md).toContain("**Originality:** 90/100");
    expect(md).toContain("⚠️ **Research Bottleneck:** Tokenization speed is too slow.");
    expect(md).toContain("### Architecture\n```\nPython -> Rust FFI -> FastAPI\n```");
    expect(md).toContain("### Week 1\n- [ ] Week 1: Rust core");
  });
});
