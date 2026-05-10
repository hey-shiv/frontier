import { useState } from "react";
import { useLocation } from "wouter";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import { SectionLabel } from "../components/section-label";

const AI_DOMAINS = [
  "LLMs", "Agentic AI", "Generative AI", "RAG Systems", "Computer Vision", "NLP",
  "Robotics", "Voice AI", "Audio AI", "Music AI", "Recommendation Systems",
  "AI for Finance", "Autonomous Systems", "Edge AI", "Multimodal AI", 
  "Diffusion Models", "Time Series AI", "Healthcare AI", "AI Tooling"
];

const PERSONAL_INTERESTS = [
  "Music", "Sports", "Movies", "Reading", "Gaming", "Trading",
  "Startups", "Education", "Fitness", "Fashion", "Content Creation",
  "Science", "Space", "Biology", "Finance", "Photography"
];

const COMPANIES = [
  "OpenAI", "DeepMind", "Anthropic", "Suno", "ElevenLabs",
  "Perplexity", "Mistral", "HuggingFace", "Meta AI", "NVIDIA"
];

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Researcher"];
const GOALS = ["Internship", "Research", "Startup", "Open Source"];
const TIME_OPTIONS = ["1 week", "1 month", "3 months", "6 months"];

// ─── Reusable Chip Group ──────────────────────────────────────────────────────

function ChipGroup({ 
  label, 
  items, 
  selected, 
  onToggle, 
  multi = true 
}: { 
  label: string; 
  items: string[]; 
  selected: string[]; 
  onToggle: (item: string) => void; 
  multi?: boolean;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map(item => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              style={{
                borderRadius: 999,
                fontSize: 13,
                fontFamily: "var(--font-body)",
                padding: "6px 14px",
                border: isSelected ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
                background: isSelected ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                color: isSelected ? "#93C5FD" : "var(--text-secondary)",
                boxShadow: isSelected ? "0 0 12px rgba(59,130,246,0.2)" : "none",
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
              onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
              onPointerUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onPointerLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function IndexPage() {
  const [, setLocation] = useLocation();
  const revealRef = useScrollReveal();

  // We lift the state out to generate.tsx later via router state, 
  // but for the visual redesign, we'll keep state here and pass it via URL state.
  const [domains, setDomains] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>(["Intermediate"]);
  const [goal, setGoal] = useState<string[]>(["Startup"]);
  const [time, setTime] = useState<string[]>(["3 months"]);

  const toggleMulti = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => (item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const toggleSingle = (setList: React.Dispatch<React.SetStateAction<string[]>>) => (item: string) => {
    setList([item]);
  };

  const handleGenerate = () => {
    if (domains.length === 0) return;
    // Build query params
    const q = new URLSearchParams();
    domains.forEach(d => q.append("d", d));
    interests.forEach(i => q.append("i", i));
    companies.forEach(c => q.append("c", c));
    q.set("e", experience[0]);
    q.set("g", goal[0]);
    q.set("t", time[0]);
    
    setLocation(`/generate?${q.toString()}`);
  };

  return (
    <div style={{ paddingTop: 140, paddingBottom: 100, maxWidth: "80rem", margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
      
      {/* Hero */}
      <div style={{ marginBottom: 100 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(56px, 8vw, 100px)",
          color: "#F0F4FF",
          lineHeight: 1.0,
          letterSpacing: "-0.01em",
          margin: "0 0 24px",
        }}>
          Turn Intent Into<br />Specification.
        </h1>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
        }}>
          AI Career Intelligence Engine
        </div>
      </div>

      {/* Configuration Form */}
      <div ref={revealRef}>
        <SectionLabel label="GENERATE" />
        
        <div style={{ maxWidth: 800 }}>
          <ChipGroup 
            label="1. Target Domains" 
            items={AI_DOMAINS} 
            selected={domains} 
            onToggle={toggleMulti(domains, setDomains)} 
          />
          <ChipGroup 
            label="2. Context & Interests" 
            items={PERSONAL_INTERESTS} 
            selected={interests} 
            onToggle={toggleMulti(interests, setInterests)} 
          />
          <ChipGroup 
            label="3. Ideal Companies" 
            items={COMPANIES} 
            selected={companies} 
            onToggle={toggleMulti(companies, setCompanies)} 
          />
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            <ChipGroup 
              label="Experience" 
              items={EXPERIENCE_LEVELS} 
              selected={experience} 
              onToggle={toggleSingle(setExperience)} 
              multi={false}
            />
            <ChipGroup 
              label="Goal" 
              items={GOALS} 
              selected={goal} 
              onToggle={toggleSingle(setGoal)} 
              multi={false}
            />
            <ChipGroup 
              label="Timeline" 
              items={TIME_OPTIONS} 
              selected={time} 
              onToggle={toggleSingle(setTime)} 
              multi={false}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={domains.length === 0}
            style={{
              width: "100%",
              height: 52,
              background: domains.length === 0 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #3B82F6, #6366F1)",
              borderRadius: 8,
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 15,
              color: domains.length === 0 ? "rgba(255,255,255,0.3)" : "#FFFFFF",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              border: "none",
              cursor: domains.length === 0 ? "not-allowed" : "pointer",
              transition: "all 300ms var(--ease-out)",
              marginTop: 20,
              opacity: domains.length === 0 ? 0.3 : 1,
              boxShadow: domains.length === 0 ? "none" : "0 0 32px rgba(99,102,241,0.35)",
            }}
            onMouseEnter={(e) => {
              if (domains.length > 0) {
                e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.5)";
                e.currentTarget.style.filter = "brightness(1.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (domains.length > 0) {
                e.currentTarget.style.boxShadow = "0 0 32px rgba(99,102,241,0.35)";
                e.currentTarget.style.filter = "brightness(1)";
              }
            }}
            onPointerDown={(e) => {
              if (domains.length > 0) e.currentTarget.style.transform = "scale(0.98)";
            }}
            onPointerUp={(e) => {
              if (domains.length > 0) e.currentTarget.style.transform = "scale(1)";
            }}
            onPointerLeave={(e) => {
              if (domains.length > 0) e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {domains.length === 0 ? "SELECT DOMAIN TO CONTINUE" : "GENERATE PROJECTS →"}
          </button>
        </div>
      </div>
    </div>
  );
}       onPointerDown={(e) => {
              if (domains.length > 0) e.currentTarget.style.transform = "scale(0.98)";
            }}
            onPointerUp={(e) => {
              if (domains.length > 0) e.currentTarget.style.transform = "scale(1)";
            }}
            onPointerLeave={(e) => {
              if (domains.length > 0) e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {domains.length === 0 ? "SELECT DOMAIN TO CONTINUE" : "INITIALIZE GENERATION"}
          </button>
        </div>
      </div>
    </div>
  );
}