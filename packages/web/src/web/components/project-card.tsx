import { useState } from "react";
import {
  Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Clock, Zap,
  Rocket, Star, Code2, Database, Globe, ChevronRight, Brain,
  Layers, Lightbulb, TrendingUp, Cpu, AlertTriangle,
  FlaskConical, BarChart3, BookOpen, Sparkles,
} from "lucide-react";
import { ScorePill } from "./ui/score-pill";
import type { ProjectDetail } from "@frontier/shared";

interface Props {
  project: ProjectDetail;
  index: number;
  isSaved?: boolean;
  onSave?: () => void;
}

// ─── Local helpers not shared with generate flow ──────────────────────────────

function SectionHeader({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
      <Icon size={12} color={color} />
      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
        {label}
      </span>
    </div>
  );
}

function TagList({ items, color }: { items: string[]; color: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {items.map((item) => (
        <span key={item} style={{
          fontSize: 12, color,
          background: `${color}0F`,
          border: `1px solid ${color}22`,
          padding: "3px 9px", borderRadius: 5,
        }}>{item}</span>
      ))}
    </div>
  );
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const RESEARCH_LEVEL_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Publishable: { color: "#A78BFA", bg: "rgba(139,92,246,0.1)",   border: "rgba(139,92,246,0.25)" },
  Research:    { color: "#7EB0D4", bg: "rgba(74,127,165,0.12)",  border: "rgba(74,127,165,0.28)" },
  Startup:     { color: "#5BB888", bg: "rgba(61,158,106,0.1)",   border: "rgba(61,158,106,0.25)" },
  Internship:  { color: "#C4943A", bg: "rgba(196,148,58,0.1)",   border: "rgba(196,148,58,0.25)" },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner:     "#5BB888",
  Intermediate: "#C4943A",
  Advanced:     "#C94F43",
  Expert:       "#A78BFA",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectCard({ project, index, isSaved, onSave }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const difficultyColor = DIFFICULTY_COLOR[project.difficulty] ?? "#C4943A";
  const researchLevel = project.researchLevel ?? "Research";
  const rlCfg = RESEARCH_LEVEL_CONFIG[researchLevel] ?? RESEARCH_LEVEL_CONFIG.Research;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${hovered ? "rgba(201,79,67,0.22)" : "var(--border)"}`,
        background: "var(--bg-2)",
        transition: "all 0.22s ease",
        boxShadow: hovered ? "0 8px 32px rgba(201,79,67,0.07), 0 2px 8px rgba(0,0,0,0.3)" : "none",
        opacity: 0,
        animation: `fadeUp 0.4s ease forwards`,
        animationDelay: `${index * 70}ms`,
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 2, background: "linear-gradient(90deg, var(--accent), transparent 70%)" }} />

      <div style={{ padding: "22px 22px 0" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            {/* Badge row */}
            <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{
                fontSize: 10, fontWeight: 600, color: "#9A8ECF",
                background: "rgba(124,111,160,0.12)", border: "1px solid rgba(124,111,160,0.22)",
                padding: "2px 9px", borderRadius: 999, letterSpacing: "0.04em",
                fontFamily: "var(--font-mono)",
              }}>{project.category}</span>

              <span style={{
                fontSize: 10, fontWeight: 600, color: difficultyColor,
                background: `${difficultyColor}10`, border: `1px solid ${difficultyColor}25`,
                padding: "2px 9px", borderRadius: 999,
                fontFamily: "var(--font-mono)",
              }}>{project.difficulty}</span>

              <span style={{
                fontSize: 10, fontWeight: 700, color: rlCfg.color,
                background: rlCfg.bg, border: `1px solid ${rlCfg.border}`,
                padding: "2px 9px", borderRadius: 999,
                display: "flex", alignItems: "center", gap: 4,
                fontFamily: "var(--font-mono)",
              }}>
                <BookOpen size={9} />
                {researchLevel}
              </span>
            </div>

            <h3 className="font-display" style={{
              fontSize: 17, fontWeight: 700, color: "var(--text-primary)",
              margin: 0, letterSpacing: "-0.015em", lineHeight: 1.3,
            }}>{project.title}</h3>
          </div>

          <button
            onClick={onSave}
            disabled={isSaved}
            style={{
              background: "none",
              border: `1px solid ${isSaved ? "rgba(201,79,67,0.35)" : "var(--border)"}`,
              borderRadius: 7,
              cursor: isSaved ? "default" : "pointer",
              color: isSaved ? "var(--accent)" : "var(--text-muted)",
              padding: "7px",
              display: "flex",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isSaved) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,79,67,0.35)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaved) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              }
            }}
          >{isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}</button>
        </div>

        {/* Pitch */}
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 12px" }}>
          {project.pitch}
        </p>

        {/* Problem Statement */}
        {project.problemStatement && (
          <div style={{
            fontSize: 12, color: "#B0BAC8",
            background: "rgba(255,255,255,0.025)",
            borderLeft: "2px solid var(--accent)",
            borderRadius: "0 8px 8px 0",
            padding: "9px 12px",
            lineHeight: 1.65, marginBottom: 8,
          }}>
            <span style={{ color: "#D07068", fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 3, fontFamily: "var(--font-mono)" }}>
              Problem
            </span>
            {project.problemStatement}
          </div>
        )}

        {/* Core Innovation */}
        {project.coreInnovation && (
          <div style={{
            fontSize: 12, color: "#D4AA5A",
            background: "rgba(196,148,58,0.06)",
            border: "1px solid rgba(196,148,58,0.18)",
            borderRadius: 8,
            padding: "9px 12px",
            lineHeight: 1.65, marginBottom: 8,
            display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <Sparkles size={12} color="#C4943A" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ color: "#C4943A", fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 2, fontFamily: "var(--font-mono)" }}>
                Core Innovation
              </span>
              {project.coreInnovation}
            </div>
          </div>
        )}

        {/* Research Bottleneck */}
        {project.researchBottleneck && (
          <div style={{
            display: "flex", gap: 8, alignItems: "flex-start",
            fontSize: 12, color: "#D48888",
            background: "rgba(201,79,67,0.06)",
            border: "1px solid rgba(201,79,67,0.16)",
            borderRadius: 8, padding: "8px 11px", marginBottom: 14,
          }}>
            <AlertTriangle size={12} color="#C94F43" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <span style={{ color: "#C94F43", fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 2, fontFamily: "var(--font-mono)" }}>
                Research Challenge
              </span>
              {project.researchBottleneck}
            </div>
          </div>
        )}

        {/* Why it matters */}
        {project.whyItMatters && (
          <div style={{
            fontSize: 12, color: "#8A8A8A",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 8, padding: "9px 12px",
            lineHeight: 1.65, marginBottom: 14,
          }}>
            <span style={{ color: "var(--accent)", fontWeight: 600, marginRight: 5, fontSize: 10, letterSpacing: "0.04em" }}>Why it matters —</span>
            {project.whyItMatters}
          </div>
        )}

        {/* Score pills — 4 */}
        <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
          <ScorePill value={project.originalityScore} label="Originality" icon={Star} />
          <ScorePill value={project.recruiterScore} label="Recruiter" icon={Zap} />
          <ScorePill value={project.startupScore} label="Startup" icon={Rocket} />
          {project.publishabilityScore !== undefined && (
            <ScorePill value={project.publishabilityScore} label="Publish" icon={BookOpen} />
          )}
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)" }}>
            <Clock size={11} color="var(--text-dim)" />
            {project.timeEstimate}
          </div>
          {project.targetCompanies.slice(0, 3).map((co) => (
            <span key={co} style={{
              fontSize: 11, fontWeight: 500, color: "#7EB0D4",
              background: "rgba(74,127,165,0.1)", border: "1px solid rgba(74,127,165,0.2)",
              padding: "2px 8px", borderRadius: 999,
            }}>{co}</span>
          ))}
        </div>

        {/* Tech stack preview */}
        {project.techStack && project.techStack.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {project.techStack.slice(0, 5).map((t) => (
              <span key={t} style={{
                fontSize: 11, color: "#9A8ECF",
                background: "rgba(124,111,160,0.08)",
                border: "1px solid rgba(124,111,160,0.16)",
                padding: "2px 8px", borderRadius: 5,
                fontFamily: "var(--font-mono)",
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
          {project.tags.slice(0, 5).map((tag) => (
            <span key={tag} style={{
              fontSize: 11, color: "var(--text-muted)",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              padding: "2px 9px", borderRadius: 999,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", padding: "11px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: expanded ? "rgba(201,79,67,0.05)" : "rgba(255,255,255,0.015)",
          border: "none", borderTop: "1px solid var(--border)",
          cursor: "pointer", color: "var(--text-muted)",
          fontSize: 12, fontWeight: 500,
          fontFamily: "var(--font-body)", transition: "all 0.15s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
        }}
      >
        <span>{expanded ? "Hide Details" : "Full Roadmap & Details"}</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expanded section */}
      {expanded && (
        <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Evaluation Metrics */}
          {project.evaluationMetrics && project.evaluationMetrics.length > 0 && (
            <div>
              <SectionHeader icon={BarChart3} label="Evaluation Metrics" color="#9A8ECF" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {project.evaluationMetrics.map((metric, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <FlaskConical size={11} color="#9A8ECF" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "#A89ECF", lineHeight: 1.55 }}>{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {project.requiredSkills && project.requiredSkills.length > 0 && (
            <div>
              <SectionHeader icon={Brain} label="Required Skills" color="#7EB0D4" />
              <TagList items={project.requiredSkills} color="#7EB0D4" />
            </div>
          )}

          {/* Full Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div>
              <SectionHeader icon={Layers} label="Full Tech Stack" color="#9A8ECF" />
              <TagList items={project.techStack} color="#9A8ECF" />
            </div>
          )}

          {/* Recommended Models */}
          {project.recommendedModels && project.recommendedModels.length > 0 && (
            <div>
              <SectionHeader icon={Cpu} label="Recommended Models" color="#C4943A" />
              <TagList items={project.recommendedModels} color="#C4943A" />
            </div>
          )}

          {/* Architecture */}
          <div>
            <SectionHeader icon={Code2} label="Architecture" color="#D07068" />
            <p style={{
              fontSize: 12, color: "#C0A098",
              background: "rgba(201,79,67,0.05)", border: "1px solid rgba(201,79,67,0.14)",
              padding: "11px 14px", borderRadius: 8, margin: 0, lineHeight: 1.6,
              fontFamily: "var(--font-mono)",
            }}>{project.architecture}</p>
          </div>

          {/* Roadmap */}
          <div>
            <SectionHeader icon={ChevronRight} label="Implementation Roadmap" color="#7EB0D4" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {project.roadmap.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(74,127,165,0.12)", border: "1px solid rgba(74,127,165,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: "#7EB0D4",
                    flexShrink: 0, marginTop: 1,
                    fontFamily: "var(--font-mono)",
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Datasets + APIs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <SectionHeader icon={Database} label="Datasets" color="#5BA88A" />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {project.datasets.map((d) => (
                  <div key={d} style={{
                    fontSize: 12, color: "#6AB89A",
                    background: "rgba(61,158,106,0.07)", border: "1px solid rgba(61,158,106,0.14)",
                    padding: "3px 9px", borderRadius: 5,
                  }}>{d}</div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader icon={Globe} label="APIs & Tools" color="#9A8ECF" />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {project.apis.map((a) => (
                  <div key={a} style={{
                    fontSize: 12, color: "#A89ECF",
                    background: "rgba(124,111,160,0.07)", border: "1px solid rgba(124,111,160,0.14)",
                    padding: "3px 9px", borderRadius: 5,
                  }}>{a}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Deployment */}
          <div>
            <SectionHeader icon={Rocket} label="Deployment Strategy" color="#5BB888" />
            <p style={{
              fontSize: 12, color: "#6AB89A",
              background: "rgba(61,158,106,0.07)", border: "1px solid rgba(61,158,106,0.14)",
              padding: "10px 12px", borderRadius: 7, margin: 0, lineHeight: 1.6,
            }}>{project.deployment}</p>
          </div>

          {/* Scaling Ideas */}
          {project.scalingIdeas && project.scalingIdeas.length > 0 && (
            <div>
              <SectionHeader icon={TrendingUp} label="Scaling Ideas" color="#5A8FAA" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {project.scalingIdeas.map((idea, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "#5A8FAA", marginTop: 6, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55 }}>{idea}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Future Improvements */}
          {project.futureImprovements && project.futureImprovements.length > 0 && (
            <div>
              <SectionHeader icon={Lightbulb} label="Future Improvements" color="#C4943A" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {project.futureImprovements.map((imp) => (
                  <span key={imp} style={{
                    fontSize: 11, color: "#C4943A",
                    background: "rgba(196,148,58,0.08)", border: "1px solid rgba(196,148,58,0.18)",
                    padding: "3px 9px", borderRadius: 999,
                  }}>{imp}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
