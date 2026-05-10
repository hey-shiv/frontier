import { describe, expect, test } from "bun:test";
import { generateProjects } from "../api/data/mockGenerator";

describe("mockGenerator", () => {
  test("generates exactly 6 unique projects", () => {
    const input = {
      domains: ["Agents", "Robotics"],
      interests: ["Open Source"],
      companies: ["OpenAI"],
      experience: "Advanced",
      goal: "Startup",
      timeCommitment: "3 months"
    };
    
    const projects = generateProjects(input);
    expect(projects.length).toBe(6);
    
    const ids = new Set(projects.map(p => p.id));
    expect(ids.size).toBe(6); // All 6 must have unique IDs
  });

  test("generates 6 unique projects even if domains are small", () => {
    const input = {
      domains: ["Web"],
      interests: [],
      companies: [],
      experience: "Beginner",
      goal: "Startup",
      timeCommitment: "1 month"
    };
    
    const projects = generateProjects(input);
    expect(projects.length).toBe(6);
    
    const ids = new Set(projects.map(p => p.id));
    expect(ids.size).toBe(6);
  });
});
