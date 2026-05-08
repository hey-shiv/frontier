import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Map, Clock, ChevronDown, ChevronUp, ExternalLink, Target } from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  Advanced: "#EF4444",
  Researcher: "#8B5CF6",
  Intermediate: "#F59E0B",
};

export default function RoadmapsPage() {
  const [expandedId, setExpandedId] = useState<string | null>("ml-engineer");

  const { data, isLoading } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: async () => {
      const res = await api.roadmaps.$get();
      return res.json();
    },
  });

  const roadmaps = (data as any)?.roadmaps || [];

  return (
    <div style={{ minHeight: "100vh", paddingTop: 58, background: "var(--bg)" }}>
      {/* Header */}
      <div
        className="grid-texture"
        style={{
          padding: "60px 24px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 240,
            background: "radial-gradient(ellipse at bottom, rgba(201,79,67,0.13) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 999,
            background: "var(--accent-soft)",
            border: "1px solid var(--accent-border)",
            fontSize: 12,
            color: "#D07068",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          <span className="live-dot" />
          <Map size={11} color="var(--accent)" />
          Career Paths
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            margin: "0 0 14px",
          }}
        >
          Career <span className="gradient-text">Roadmaps</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
          Step-by-step paths to your AI career goal — with milestones, resources, and timelines
        </p>
      </div>

      {/* Roadmaps */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass shimmer" style={{ borderRadius: 16, height: 180 }} />
          ))
        ) : (
          roadmaps.map((roadmap: any, i: number) => {
            const isExpanded = expandedId === roadmap.id;
            const diffColor = DIFFICULTY_COLORS[roadmap.difficulty] || "#6366F1";

            return (
              <div
                key={roadmap.id}
                className="glass"
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  opacity: 0,
                  animation: `fadeUp 0.4s ease forwards`,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Top border */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${diffColor}, transparent)` }} />

                <div style={{ padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: diffColor,
                            background: `${diffColor}15`,
                            border: `1px solid ${diffColor}30`,
                            padding: "2px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {roadmap.difficulty}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={10} />
                          {roadmap.duration}
                        </span>
                      </div>
                      <h2
                        className="font-display"
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: "var(--text-primary)",
                          margin: "0 0 6px",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {roadmap.title}
                      </h2>
                      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                        {roadmap.description}
                      </p>
                    </div>
                  </div>

                  {/* Target companies */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {roadmap.targetCompanies.map((co: string) => (
                      <span
                        key={co}
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                          background: "var(--accent-soft)",
                          border: "1px solid var(--accent-border)",
                          padding: "3px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {co}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expand */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : roadmap.id)}
                  style={{
                    width: "100%",
                    padding: "10px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: isExpanded ? `${diffColor}08` : "rgba(255,255,255,0.02)",
                    border: "none",
                    borderTop: "1px solid var(--border)",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "var(--font-body)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{isExpanded ? "Collapse Roadmap" : "View Full Roadmap"}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {/* Steps */}
                {isExpanded && (
                  <div style={{ padding: "28px" }}>
                    {/* Phase timeline */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {roadmap.steps.map((step: any, si: number) => (
                        <div
                          key={si}
                          style={{
                            display: "flex",
                            gap: 20,
                            position: "relative",
                          }}
                        >
                          {/* Left line */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: `${diffColor}20`,
                                border: `2px solid ${diffColor}60`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                color: diffColor,
                                flexShrink: 0,
                                zIndex: 1,
                              }}
                            >
                              {si + 1}
                            </div>
                            {si < roadmap.steps.length - 1 && (
                              <div
                                style={{
                                  width: 2,
                                  flex: 1,
                                  minHeight: 20,
                                  background: `linear-gradient(180deg, ${diffColor}40, transparent)`,
                                  margin: "4px 0",
                                }}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, paddingBottom: si < roadmap.steps.length - 1 ? 24 : 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                              <h4
                                className="font-display"
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: "var(--text-primary)",
                                  margin: 0,
                                  letterSpacing: "-0.01em",
                                }}
                              >
                                {step.phase}
                              </h4>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  background: "rgba(255,255,255,0.03)",
                                  border: "1px solid var(--border)",
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <Clock size={9} />
                                {step.duration}
                              </span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {step.topics.map((topic: string) => (
                                <span
                                  key={topic}
                                  style={{
                                    fontSize: 12,
                                    color: "var(--text-secondary)",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid var(--border)",
                                    padding: "4px 10px",
                                    borderRadius: 8,
                                  }}
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resources */}
                    {roadmap.resources && (
                      <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <Target size={13} color={diffColor} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Key Resources
                          </span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {roadmap.resources.map((r: string) => (
                            <span
                              key={r}
                              style={{
                                fontSize: 13,
                                color: "var(--text-secondary)",
                                background: "var(--accent-soft)",
                                border: "1px solid var(--accent-border)",
                                padding: "5px 12px",
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <ExternalLink size={11} />
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
