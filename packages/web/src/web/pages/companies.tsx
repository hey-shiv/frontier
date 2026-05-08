import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Building2, Search, Users, Zap, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["companies", search],
    queryFn: async () => {
      const res = await api.companies.$get({ query: { search } });
      return res.json();
    },
  });

  const companies = (data as any)?.companies || [];

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
          <Building2 size={11} color="var(--accent)" />
          Company Intelligence
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
          AI Company <span className="gradient-text">Explorer</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto 32px" }}>
          Deep profiles of frontier AI companies — tech stacks, research directions, and what they're building
        </p>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
              fontFamily: "var(--font-body)",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 20,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass shimmer"
                style={{ borderRadius: 16, height: 220 }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 20,
            }}
          >
            {companies.map((company: any, i: number) => {
              const isExpanded = expandedSlug === company.slug;
              return (
                <div
                  key={company.slug}
                  className="glass"
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    opacity: 0,
                    animation: `fadeUp 0.4s ease forwards`,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  {/* Color top bar */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${company.logoColor}, transparent)` }} />

                  <div style={{ padding: 24 }}>
                    {/* Company header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: `${company.logoColor}20`,
                              border: `1px solid ${company.logoColor}40`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: 700,
                              color: company.logoColor,
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {company.name[0]}
                          </div>
                          <div>
                            <h3
                              className="font-display"
                              style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}
                            >
                              {company.name}
                            </h3>
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{company.stage}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        {company.hiring && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#10B981",
                              background: "rgba(16,185,129,0.12)",
                              border: "1px solid rgba(16,185,129,0.25)",
                              padding: "2px 8px",
                              borderRadius: 999,
                            }}
                          >
                            Hiring
                          </span>
                        )}
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          <Users size={11} style={{ display: "inline", marginRight: 4 }} />
                          {company.openRoles} roles
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }}>
                      {company.tagline}
                    </p>

                    {/* Focus areas */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {company.focus.map((f: string) => (
                        <span
                          key={f}
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: company.logoColor,
                            background: `${company.logoColor}12`,
                            border: `1px solid ${company.logoColor}25`,
                            padding: "3px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Recent work preview */}
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "10px 12px",
                        marginBottom: 16,
                      }}
                    >
                      <span style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Latest
                      </span>
                      {company.recentWork[0]}
                    </div>
                  </div>

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedSlug(isExpanded ? null : company.slug)}
                    style={{
                      width: "100%",
                      padding: "10px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: isExpanded ? "rgba(201,79,67,0.05)" : "rgba(255,255,255,0.02)",
                      border: "none",
                      borderTop: "1px solid var(--border)",
                      cursor: "pointer",
                      color: "var(--text-secondary)",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "var(--font-body)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{isExpanded ? "Show Less" : "Full Profile"}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
                      {/* All recent work */}
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
                          Recent Highlights
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {company.recentWork.map((item: string, i: number) => (
                            <div
                              key={i}
                              style={{
                                fontSize: 13,
                                color: "var(--text-secondary)",
                                display: "flex",
                                gap: 8,
                                alignItems: "flex-start",
                              }}
                            >
                              <span style={{ color: company.logoColor, flexShrink: 0, marginTop: 2 }}>→</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                          Tech Stack
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {company.techStack.map((t: string) => (
                            <span
                              key={t}
                              className="font-mono"
                              style={{
                                fontSize: 11,
                                color: "var(--text-secondary)",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid var(--border)",
                                padding: "3px 10px",
                                borderRadius: 6,
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Research Areas */}
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                          Research Focus
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {company.researchAreas.map((r: string) => (
                            <span
                              key={r}
                              style={{
                                fontSize: 11,
                                color: "#D07068",
                                background: "var(--accent-soft)",
                                border: "1px solid var(--accent-border)",
                                padding: "3px 10px",
                                borderRadius: 999,
                              }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            color: company.logoColor,
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          <ExternalLink size={13} />
                          Visit {company.name}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
