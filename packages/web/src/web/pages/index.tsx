import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { SectionLabel } from "../components/section-label";
import { useScrollReveal } from "../hooks/use-scroll-reveal";

const AI_DOMAINS = [
  "LLMs", "Agentic AI", "Generative AI", "RAG Systems", "Computer Vision", "NLP",
  "Robotics", "Voice AI", "Audio AI", "Music AI", "Recommendation Systems",
  "AI for Finance", "Autonomous Systems", "Edge AI", "Multimodal AI",
  "Diffusion Models", "Time Series AI", "Healthcare AI", "AI Tooling",
];
const PERSONAL_INTERESTS = [
  "Music", "Sports", "Movies", "Reading", "Gaming", "Trading",
  "Startups", "Education", "Fitness", "Fashion", "Content Creation",
  "Science", "Space", "Biology", "Finance", "Photography",
];
const COMPANIES = [
  "OpenAI", "DeepMind", "Anthropic", "Suno", "ElevenLabs",
  "Perplexity", "Mistral", "HuggingFace", "Meta AI", "NVIDIA",
];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Researcher"];
const GOALS = ["Internship", "Research", "Startup", "Open Source"];
const TIME_OPTIONS = ["1 week", "1 month", "3 months", "6 months"];

// ─── Chip ────────────────────────────────────────────────────────────────────

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: "var(--r-pill)",
        fontSize: 13,
        fontFamily: "var(--font-body)",
        fontWeight: 400,
        padding: "7px 16px",
        border: selected
          ? "1px solid rgba(59,130,246,0.5)"
          : "1px solid var(--border)",
        background: selected
          ? "rgba(59,130,246,0.12)"
          : "var(--surface)",
        color: selected ? "#93C5FD" : "var(--text-2)",
        boxShadow: selected
          ? "0 0 0 3px rgba(59,130,246,0.07), 0 0 16px rgba(59,130,246,0.12)"
          : "none",
        cursor: "pointer",
        transition: "all 150ms var(--ease-out)",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
      onPointerUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onPointerLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {label}
    </button>
  );
}

// ─── ChipGroup ───────────────────────────────────────────────────────────────

function ChipGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="reveal-target" style={{ marginBottom: 0 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--text-4)",
          marginBottom: 16,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={selected.includes(item)}
            onClick={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background:
          "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
        margin: "40px 0",
      }}
    />
  );
}

// ─── Stat Pill ───────────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
      }}
    >
      <span style={{ color: "var(--text-1)", fontWeight: 500 }}>{value}</span>
      <span style={{ color: "var(--text-4)" }}>{label}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function IndexPage() {
  const [, setLocation] = useLocation();
  const revealRef = useScrollReveal();

  const [domains, setDomains] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>(["Intermediate"]);
  const [goal, setGoal] = useState<string[]>(["Startup"]);
  const [time, setTime] = useState<string[]>(["3 months"]);

  const toggleMulti = useCallback(
    (
      list: string[],
      setList: React.Dispatch<React.SetStateAction<string[]>>
    ) =>
      (item: string) => {
        setList(
          list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
        );
      },
    []
  );

  const toggleSingle =
    (setList: React.Dispatch<React.SetStateAction<string[]>>) =>
    (item: string) => {
      setList([item]);
    };

  const canGenerate = domains.length > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const q = new URLSearchParams();
    domains.forEach((d) => q.append("d", d));
    interests.forEach((i) => q.append("i", i));
    companies.forEach((c) => q.append("c", c));
    q.set("e", experience[0]);
    q.set("g", goal[0]);
    q.set("t", time[0]);
    setLocation(`/generate?${q.toString()}`);
  };

  return (
    <div
      style={{
        paddingTop: 120,
        paddingBottom: 120,
        maxWidth: "82rem",
        margin: "0 auto",
        paddingLeft: 32,
        paddingRight: 32,
      }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 96, position: "relative" }}>
        {/* Decorative glow orb behind the hero text */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -60,
            left: -80,
            width: 600,
            height: 400,
            background:
              "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            className="fade-up"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(52px, 7.5vw, 96px)",
              color: "var(--text-1)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: "0 0 28px",
            }}
          >
            Turn Intent Into{" "}
            <span
              style={{
                display: "block",
                background:
                  "linear-gradient(135deg, var(--text-1) 30%, var(--blue) 80%, var(--indigo) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Specification.
            </span>
          </h1>

          <div
            className="fade-up"
            style={{
              animationDelay: "0.1s",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--text-4)",
              marginBottom: 28,
            }}
          >
            AI Career Intelligence Engine
          </div>

          {/* Stats row */}
          <div
            className="fade-up"
            style={{
              animationDelay: "0.2s",
              display: "flex",
              gap: 24,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <StatPill value="6" label="projects per generation" />
            <div style={{ width: 1, height: 12, background: "var(--border)" }} />
            <StatPill value="~8s" label="fast preview" />
            <div style={{ width: 1, height: 12, background: "var(--border)" }} />
            <StatPill value="Gemini → Groq → OpenRouter" label="provider chain" />
          </div>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <div ref={revealRef} style={{ maxWidth: 860 }}>
        <div className="reveal-target">
          <SectionLabel label="CONFIGURE" />
        </div>

        {/* 1. Domains */}
        <ChipGroup
          label="01 · Target Domains"
          items={AI_DOMAINS}
          selected={domains}
          onToggle={toggleMulti(domains, setDomains)}
        />
        <Divider />

        {/* 2. Interests */}
        <ChipGroup
          label="02 · Context & Interests"
          items={PERSONAL_INTERESTS}
          selected={interests}
          onToggle={toggleMulti(interests, setInterests)}
        />
        <Divider />

        {/* 3. Companies */}
        <ChipGroup
          label="03 · Ideal Companies"
          items={COMPANIES}
          selected={companies}
          onToggle={toggleMulti(companies, setCompanies)}
        />
        <Divider />

        {/* 4. Experience / Goal / Time — three columns */}
        <div
          className="reveal-target"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
            marginBottom: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--text-4)",
                marginBottom: 16,
              }}
            >
              04 · Experience
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {EXPERIENCE_LEVELS.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={experience.includes(item)}
                  onClick={() => toggleSingle(setExperience)(item)}
                />
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--text-4)",
                marginBottom: 16,
              }}
            >
              05 · Goal
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {GOALS.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={goal.includes(item)}
                  onClick={() => toggleSingle(setGoal)(item)}
                />
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--text-4)",
                marginBottom: 16,
              }}
            >
              06 · Timeline
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TIME_OPTIONS.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={time.includes(item)}
                  onClick={() => toggleSingle(setTime)(item)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          className="reveal-target"
          style={{ marginTop: 56 }}
        >
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{
              width: "100%",
              height: 60,
              position: "relative",
              overflow: "hidden",
              background: canGenerate
                ? "linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #4F46E5 100%)"
                : "rgba(255,255,255,0.04)",
              border: canGenerate
                ? "1px solid rgba(99,102,241,0.4)"
                : "1px solid var(--border-subtle)",
              borderRadius: "var(--r-md)",
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: canGenerate ? "#fff" : "var(--text-4)",
              cursor: canGenerate ? "pointer" : "not-allowed",
              transition: "all 250ms var(--ease-out)",
              boxShadow: canGenerate
                ? "0 0 0 0 rgba(99,102,241,0)"
                : "none",
            }}
            onMouseEnter={(e) => {
              if (!canGenerate) return;
              e.currentTarget.style.boxShadow =
                "0 0 48px rgba(99,102,241,0.4), 0 8px 32px rgba(59,130,246,0.3)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              if (!canGenerate) return;
              e.currentTarget.style.boxShadow = "0 0 0 0 rgba(99,102,241,0)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onPointerDown={(e) => {
              if (!canGenerate) return;
              e.currentTarget.style.transform = "scale(0.985) translateY(0)";
            }}
            onPointerUp={(e) => {
              if (!canGenerate) return;
              e.currentTarget.style.transform = "scale(1) translateY(-1px)";
            }}
          >
            {canGenerate
              ? `INITIALIZE GENERATION · ${domains.length} ${domains.length === 1 ? "DOMAIN" : "DOMAINS"} →`
              : "SELECT AT LEAST ONE DOMAIN"}
          </button>
        </div>
      </div>
    </div>
  );
}