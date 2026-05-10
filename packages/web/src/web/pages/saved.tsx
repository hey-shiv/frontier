import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSessionId } from "../lib/session";
import type { SavedProject } from "../../shared/types";
import { SectionLabel } from "../components/section-label";
import { useScrollReveal } from "../hooks/use-scroll-reveal";

export default function SavedPage() {
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const revealRef = useScrollReveal();

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

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 300, color: "rgba(255,255,255,0.15)" }}>
          Loading library...
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 300, color: "rgba(255,255,255,0.15)" }}>
          Your library awaits.
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 120, paddingBottom: 100 }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", paddingLeft: 24, paddingRight: 24, marginBottom: 24 }}>
        <SectionLabel label="SAVED LIBRARY" />
      </div>

      <div 
        ref={revealRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 1, // Flush grid illusion
          background: "#000", // Black gap
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {projects.map((project) => {
          let scoreColor = "#F87171";
          let scoreBg = "rgba(248,113,113,0.1)";
          if (project.originalityScore >= 80) {
            scoreColor = "#34D399";
            scoreBg = "rgba(52,211,153,0.1)";
          } else if (project.originalityScore >= 60) {
            scoreColor = "#FBBF24";
            scoreBg = "rgba(251,191,36,0.1)";
          }

          return (
            <div
              key={project.id}
              style={{
                background: "rgba(255,255,255,0.02)",
                padding: 24,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: 220,
                transition: "background 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                const btn = e.currentTarget.querySelector('.del-btn') as HTMLElement;
                if (btn) btn.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                const btn = e.currentTarget.querySelector('.del-btn') as HTMLElement;
                if (btn) btn.style.opacity = "0";
              }}
            >
              {/* Year saved */}
              <div style={{
                position: "absolute",
                top: 16,
                right: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
              }}>
                {new Date(project.createdAt).getFullYear()}
              </div>

              {/* Title & Tags */}
              <div>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: 18,
                  color: "#F0F4FF",
                  margin: "0 0 12px",
                  paddingRight: 32, // space for date
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.3,
                }}>
                  {project.title}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {project.tags?.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "#94A3B8",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 999,
                      padding: "2px 8px",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Score & Delete */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: scoreColor,
                  background: scoreBg,
                  padding: "4px 10px",
                  borderRadius: 999,
                }}>
                  {project.originalityScore}
                </div>
                
                <button
                  className="del-btn"
                  onClick={() => deleteMutation.mutate(project.id)}
                  disabled={deleteMutation.isPending}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "all 150ms ease",
                    padding: "4px 8px",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#F87171"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}