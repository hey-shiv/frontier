import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Sparkles, Search, X, ArrowRight, Wand2, Bot,
  Zap, Code2, Database, Globe, Brain, Layers,
  Lightbulb, TrendingUp, Cpu, BarChart3, BookOpen,
  Loader2,
} from "lucide-react";
import { PreviewCard } from "../components/generate/preview-card";
import { SkeletonCard } from "../components/ui/skeleton-card";
import { getSessionId } from "../lib/session";
import type { ProjectPreview, GenerateInput, LLMProvider } from "../../shared/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_DOMAINS = [
  "Artificial Intelligence", "Machine Learning", "Deep Learning", "Reinforcement Learning",
  "LLMs", "Agentic AI", "Generative AI", "RAG Systems", "Computer Vision", "NLP",
  "Robotics", "AI Infra", "AI Security", "AI Agents", "Voice AI", "Audio AI",
  "Music AI", "Recommendation Systems", "AI for Finance", "Quant AI",
  "Autonomous Systems", "Edge AI", "Multimodal AI", "Diffusion Models",
  "Time Series AI", "Healthcare AI", "Synthetic Data", "AI Research",
  "AI Alignment", "Open Source AI", "AI Tooling", "GPU Systems",
  "Vector Databases", "AI Search", "AI Copilots", "AI Coding Agents",
];

const PERSONAL_INTERESTS = [
  "Music", "Sports", "Movies", "Reading", "Anime", "Gaming", "Chess", "Trading",
  "Startups", "Psychology", "Education", "Productivity", "Fitness", "Fashion",
  "Social Media", "Content Creation", "Storytelling", "Science", "Space",
  "Biology", "Travel", "News", "Podcasts", "Finance", "Cars", "Cricket",
  "Football", "Photography", "Video Editing", "Streaming", "Writing",
  "Communities", "Memes",
];

const COMPANIES = [
  "OpenAI", "DeepMind", "Anthropic", "Suno", "Udio", "ElevenLabs",
  "Perplexity", "Mistral", "HuggingFace", "Meta AI", "NVIDIA",
  "Sarvam AI", "Stability AI", "Runway", "Cohere", "Inflection AI",
];

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Researcher"];
const GOALS = ["Internship", "Research", "Startup", "Open Source", "Freelancing", "Content Creation"];
const TIME_OPTIONS = ["1 week", "1 month", "3 months", "6 months"];

// ─── Chip Selector ─────────────────────────────────────────────────────────────

function ChipSelector({ title, subtitle, items, selected, onToggle, searchable }: {
  title: string; subtitle?: string; items: string[]; selected: string[];
  onToggle: (item: string) => void; searchable?: boolean;
}) {
  const [search, setSearch] = useState("");
  const filtered = search ? items.filter(i => i.toLowerCase().includes(search.toLowerCase())) : items;
  return (
    <div style={{ padding: "28px 28px 24px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {subtitle && <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{subtitle}</p>}
      </div>
      {selected.length > 0 && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px",
          borderRadius: 999, background: "var(--accent-soft)", border: "1px solid var(--accent-border)",
          color: "#D07068", fontSize: 11, fontWeight: 600, marginBottom: 14,
        }}>
          {selected.length} selected
          <button onClick={() => selected.forEach(onToggle)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#D07068", padding: 0, display: "flex" }}>
            <X size={10} />
          </button>
        </div>
      )}
      {searchable && (
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input type="text" placeholder="Search domains..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "7px 12px 7px 30px", borderRadius: 7, border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box" }}
            onFocus={e => (e.target.style.borderColor = "var(--border-hover)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")} />
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {filtered.map(item => {
          const on = selected.includes(item);
          return (
            <button key={item} onClick={() => onToggle(item)} style={{
              padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: on ? 600 : 500,
              border: `1px solid ${on ? "var(--accent-border)" : "var(--border)"}`,
              background: on ? "var(--accent-soft)" : "rgba(255,255,255,0.02)",
              color: on ? "#D07068" : "var(--text-secondary)", cursor: "pointer",
              transition: "all 0.15s ease",
            }}>
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Single-select options ──────────────────────────────────────────────────

function OptionRow({ label, options, selected, onSelect }: {
  label: string; options: string[]; selected: string; onSelect: (v: string) => void;
}) {
  return (
    <div style={{ padding: "20px 28px" }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 12px", fontFamily: "var(--font-mono)" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {options.map(opt => {
          const on = selected === opt;
          return (
            <button key={opt} onClick={() => onSelect(opt)} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: on ? 600 : 500,
              border: `1px solid ${on ? "var(--accent-border)" : "var(--border)"}`,
              background: on ? "var(--accent-soft)" : "rgba(255,255,255,0.02)",
              color: on ? "#D07068" : "var(--text-secondary)", cursor: "pointer",
              transition: "all 0.15s ease",
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stat badge ──────────────────────────────────────────────────────────────

function StatBadge({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      padding: "16px 12px", borderRadius: 12,
      background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
    }}>
      <Icon size={16} color="var(--accent)" />
      <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{value}</span>
      <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
    </div>
  );
}

// ─── Generate Page ───────────────────────────────────────────────────────────

export default function GeneratePage() {
  const [domains, setDomains] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [experience, setExperience] = useState("Intermediate");
  const [goal, setGoal] = useState("Startup");
  const [timeCommitment, setTimeCommitment] = useState("3 months");

  const [previews, setPreviews] = useState<ProjectPreview[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [meta, setMeta] = useState<{ model?: string; generatedAt?: string; provider?: LLMProvider; warning?: string } | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [duplicateIds, setDuplicateIds] = useState<Set<string>>(new Set());

  const inputSnapshot = useRef<GenerateInput | null>(null);

  const toggle = (list: string[], setList: (v: string[]) => void) => (item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleGenerate = async () => {
    if (domains.length === 0 || isGenerating) return;

    const input: GenerateInput = { domains, interests, companies, experience, goal, timeCommitment, seed: Date.now() };
    inputSnapshot.current = input;

    setIsGenerating(true);
    setPreviews([]);
    setMeta(null);

    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      const res = await fetch("/api/generate/previews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(errData.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as { previews?: ProjectPreview[]; meta?: typeof meta };
      setPreviews(data.previews ?? []);
      setMeta(data.meta ?? null);
    } catch (err) {
      console.error("Generate failed:", err);
      setMeta({ provider: "local-fallback", warning: (err as Error).message });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (project: ProjectPreview) => {
      const res = await fetch("/api/projects/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": getSessionId(),
        },
        body: JSON.stringify(project),
      });
      if (res.status === 409) return { duplicate: true, id: project.id };
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      return res.json() as Promise<{ id?: string }>;
    },
    onSuccess: (data, project) => {
      if ("duplicate" in data && data.duplicate) {
        setDuplicateIds(prev => new Set([...prev, project.id]));
      } else {
        setSavedIds(prev => new Set([...prev, project.id]));
      }
    },
  });

  const showSkeletons = isGenerating;
  const showResults = !isGenerating && previews.length > 0;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 58, background: "var(--bg)" }}>

      {/* Page Header */}
      <div className="grid-texture" style={{ padding: "56px 24px 44px", textAlign: "center", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "60%", height: 200,
          background: "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="section-label fade-up" style={{ display: "inline-flex" }}>
          <Sparkles size={11} color="var(--accent)" />
          AI Project Generator
        </div>
        <h1 className="font-display" style={{
          fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em",
          color: "var(--text-primary)", margin: "16px 0 14px", lineHeight: 1.05,
        }}>
          Build projects that <span className="gradient-text">matter</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.6 }}>
          Personalized AI project recommendations — from quick experiments to research-grade work.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {[
            { icon: Zap, label: "Fast", value: "~8s" },
            { icon: Brain, label: "Personalized", value: "100%" },
            { icon: BarChart3, label: "Scored", value: "3 metrics" },
          ].map(s => <StatBadge key={s.label} {...s} />)}
        </div>
      </div>

      {/* Input form */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{
          borderRadius: 16, overflow: "hidden",
          border: "1px solid var(--border)", background: "var(--bg-2)",
        }}>
          <ChipSelector
            title="AI Domains"
            subtitle="Pick the areas you want to work in"
            items={AI_DOMAINS}
            selected={domains}
            onToggle={toggle(domains, setDomains)}
            searchable
          />
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <ChipSelector
              title="Personal Interests"
              subtitle="We'll blend these with AI for unique angles"
              items={PERSONAL_INTERESTS}
              selected={interests}
              onToggle={toggle(interests, setInterests)}
            />
          </div>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <ChipSelector
              title="Target Companies"
              subtitle="Projects that would impress these orgs"
              items={COMPANIES}
              selected={companies}
              onToggle={toggle(companies, setCompanies)}
            />
          </div>
          <div style={{ borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="chip-grid">
            <div>
              <OptionRow label="Experience Level" options={EXPERIENCE_LEVELS} selected={experience} onSelect={setExperience} />
            </div>
            <div style={{ borderLeft: "1px solid var(--border)" }}>
              <OptionRow label="Primary Goal" options={GOALS} selected={goal} onSelect={setGoal} />
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <OptionRow label="Time Commitment" options={TIME_OPTIONS} selected={timeCommitment} onSelect={setTimeCommitment} />
          </div>

          {/* Generate button */}
          <div style={{ padding: "24px 28px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleGenerate}
              disabled={domains.length === 0 || isGenerating}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 28px", borderRadius: 10,
                background: domains.length === 0 || isGenerating ? "var(--bg-3)" : "var(--accent)",
                color: domains.length === 0 || isGenerating ? "var(--text-muted)" : "#fff",
                border: "none", cursor: domains.length === 0 || isGenerating ? "not-allowed" : "pointer",
                fontSize: 14, fontWeight: 700, letterSpacing: "0.01em",
                transition: "all 0.2s ease",
              }}
            >
              {isGenerating ? (
                <><Loader2 size={15} className="spin" /> Generating…</>
              ) : (
                <><Wand2 size={15} /> Generate Projects <ArrowRight size={13} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results section */}
      {(showSkeletons || showResults) && (
        <div id="results-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: meta?.warning ? 12 : 24, flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                {showSkeletons ? "Generating your projects…" : `${previews.length} Projects Generated`}
              </h2>
              {meta?.model && (
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-mono)" }}>
                  via {meta.model}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {showResults && meta?.provider === "local-fallback" && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700,
                  color: "#b45309", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)",
                  padding: "4px 10px", borderRadius: 999, letterSpacing: "0.05em",
                }}>
                  <Bot size={11} />
                  LOCAL FALLBACK
                </span>
              )}
              {showResults && meta?.provider && meta.provider !== "local-fallback" && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700,
                  color: "var(--text-muted)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                  padding: "4px 10px", borderRadius: 999, letterSpacing: "0.05em",
                }}>
                  <Bot size={11} />
                  {meta.provider.toUpperCase()}
                </span>
              )}
              {showResults && !meta?.provider && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700,
                  color: "var(--text-muted)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                  padding: "4px 10px", borderRadius: 999, letterSpacing: "0.05em",
                }}>
                  <Bot size={11} />
                  AI GENERATED
                </span>
              )}
              {showSkeletons && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700,
                  color: "var(--accent)", background: "var(--accent-soft)", border: "1px solid var(--accent-border)",
                  padding: "4px 10px", borderRadius: 999, letterSpacing: "0.05em",
                }}>
                  <span className="live-dot" style={{ width: 6, height: 6 }} />
                  STAGE 1 — FAST PREVIEW
                </span>
              )}
            </div>
          </div>
          {showResults && meta?.warning && (
            <div style={{
              marginBottom: 20, padding: "10px 14px", borderRadius: 8,
              background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)",
              fontSize: 12, color: "#92400e", fontFamily: "var(--font-mono)",
            }}>
              ⚠ {meta.warning}
            </div>
          )}

          {/* Cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}>
            {showSkeletons
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} index={i} />)
              : previews.map((preview, i) => (
                  <PreviewCard
                    key={preview.id}
                    preview={preview}
                    index={i}
                    input={inputSnapshot.current!}
                    isSaved={savedIds.has(preview.id)}
                    isDuplicate={duplicateIds.has(preview.id)}
                    onSave={p => saveMutation.mutate({ ...p, inputProfile: inputSnapshot.current!, providerMeta: meta ?? {} })}
                  />
                ))
            }
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .chip-grid { grid-template-columns: 1fr !important; }
          .chip-grid > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
