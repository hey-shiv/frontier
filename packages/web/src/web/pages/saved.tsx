import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Trash2, Clock } from "lucide-react";
import { getSessionId } from "../lib/session";
import type { SavedProject } from "../../shared/types";

export default function SavedPage() {
  const sessionId = getSessionId();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["saved-projects", sessionId],
    queryFn: async () => {
      const res = await fetch("/api/projects/saved", {
        headers: { "x-session-id": sessionId },
      });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      return res.json() as Promise<{ projects: SavedProject[] }>;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/projects/saved/${id}`, {
        method: "DELETE",
        headers: { "x-session-id": sessionId },
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-projects", sessionId] });
    },
  });

  const projects: SavedProject[] = data?.projects ?? [];

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
          <Bookmark size={11} color="var(--accent)" />
          Saved Projects
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            margin: "0 0 14px",
          }}
        >
          Your <span className="gradient-text">Project Library</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto" }}>
          Projects you've bookmarked for building
        </p>
      </div>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass shimmer" style={{ borderRadius: 16, height: 140 }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "var(--accent-soft)",
                border: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Bookmark size={28} color="var(--accent)" />
            </div>
            <h3
              className="font-display"
              style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}
            >
              No saved projects yet
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
              Generate project ideas and bookmark the ones you want to build
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>
              {projects.length} saved project{projects.length !== 1 ? "s" : ""}
            </p>
            {projects.map((project, i) => {
              const orgColor =
                project.originalityScore >= 85 ? "#10B981" :
                project.originalityScore >= 70 ? "#F59E0B" : "#EF4444";

              // targetCompanies is already an array — server pre-parses JSON columns
              const targetCompanies: string[] = Array.isArray(project.targetCompanies)
                ? project.targetCompanies
                : [];

              return (
                <div
                  key={project.id}
                  className="glass glass-hover"
                  style={{
                    borderRadius: 18,
                    padding: "24px",
                    opacity: 0,
                    animation: `fadeUp 0.4s ease forwards`,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: orgColor,
                            background: `${orgColor}15`,
                            border: `1px solid ${orgColor}30`,
                            padding: "2px 8px",
                            borderRadius: 999,
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {project.originalityScore}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--border)",
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          {project.difficulty}
                        </span>
                      </div>
                      <h3
                        className="font-display"
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          margin: "0 0 6px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {project.title}
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px", lineHeight: 1.5 }}>
                        {project.pitch}
                      </p>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} />
                          {project.timeEstimate}
                        </span>
                        {targetCompanies.slice(0, 2).map((co) => (
                          <span
                            key={co}
                            style={{
                              fontSize: 11,
                              color: "#D07068",
                              background: "var(--accent-soft)",
                              border: "1px solid var(--accent-border)",
                              padding: "2px 8px",
                              borderRadius: 999,
                            }}
                          >
                            {co}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteMutation.mutate(project.id)}
                      disabled={deleteMutation.isPending}
                      style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: 8,
                        display: "flex",
                        transition: "all 0.15s ease",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF4444";
                        (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                        (e.currentTarget as HTMLButtonElement).style.background = "none";
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
