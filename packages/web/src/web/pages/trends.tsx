import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { TrendingUp, Flame, ArrowUp, CheckCircle, ExternalLink, Filter } from "lucide-react";

const MOMENTUM_LABELS: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  hot: { label: "Hot", color: "#F87171", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", icon: Flame },
  rising: { label: "Rising", color: "#FCD34D", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: ArrowUp },
  established: { label: "Established", color: "#34D399", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: CheckCircle },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Agentic AI": "#6366F1",
  "Model Architecture": "#3B82F6",
  "Voice AI": "#A78BFA",
  "AI Safety": "#F59E0B",
  "Multimodal AI": "#06B6D4",
  "RAG Systems": "#10B981",
  "Edge AI": "#EC4899",
  "Synthetic Data": "#F97316",
  "Generative AI": "#8B5CF6",
  "AI Coding": "#14B8A6",
};

export default function TrendsPage() {
  const [momentum, setMomentum] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["trends", momentum],
    queryFn: async () => {
      const res = await api.trends.$get({ query: { momentum } });
      return res.json();
    },
  });

  const trends = (data as any)?.trends || [];

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
          <TrendingUp size={11} color="var(--accent)" />
          Research Intelligence
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
          AI Research <span className="gradient-text">Trends</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto 32px" }}>
          What's moving in AI research right now — from arXiv, GitHub, and industry blogs
        </p>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setMomentum("")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 999,
              border: momentum === "" ? "1px solid var(--accent-border)" : "1px solid var(--border)",
              background: momentum === "" ? "var(--accent-soft)" : "var(--surface)",
              color: momentum === "" ? "#D07068" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              transition: "all 0.15s ease",
            }}
          >
            <Filter size={12} />
            All
          </button>
          {Object.entries(MOMENTUM_LABELS).map(([key, val]) => {
            const Icon = val.icon;
            return (
              <button
                key={key}
                onClick={() => setMomentum(momentum === key ? "" : key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 999,
                  border: momentum === key ? `1px solid ${val.border}` : "1px solid var(--border)",
                  background: momentum === key ? val.bg : "var(--surface)",
                  color: momentum === key ? val.color : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "var(--font-body)",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={12} />
                {val.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trends */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass shimmer" style={{ borderRadius: 16, height: 160 }} />
          ))
        ) : (
          trends.map((trend: any, i: number) => {
            const mom = MOMENTUM_LABELS[trend.momentum];
            const Icon = mom.icon;
            const catColor = CATEGORY_COLORS[trend.category] || "#6366F1";

            return (
              <div
                key={i}
                className="glass glass-hover"
                style={{
                  borderRadius: 20,
                  padding: 28,
                  opacity: 0,
                  animation: `fadeUp 0.4s ease forwards`,
                  animationDelay: `${i * 60}ms`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Left accent */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: `linear-gradient(180deg, ${catColor}, transparent)`,
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                      {/* Category */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: catColor,
                          background: `${catColor}15`,
                          border: `1px solid ${catColor}30`,
                          padding: "2px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {trend.category}
                      </span>
                      {/* Momentum */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          color: mom.color,
                          background: mom.bg,
                          border: `1px solid ${mom.border}`,
                          padding: "2px 10px",
                          borderRadius: 999,
                        }}
                      >
                        <Icon size={10} />
                        {mom.label}
                      </span>
                    </div>

                    <h3
                      className="font-display"
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        margin: "0 0 8px",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      {trend.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                      {trend.description}
                    </p>
                  </div>

                  {/* Source */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {trend.sourceUrl ? (
                      <a
                        href={trend.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: "#D07068",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        <ExternalLink size={12} />
                        {trend.source}
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{trend.source}</span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {trend.tags.map((tag: string) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                        padding: "3px 10px",
                        borderRadius: 999,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
