import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSessionId } from "../lib/session";
import { SectionLabel } from "../components/section-label";
import { ScorePill } from "../components/ui/score-ring";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import type { SavedProject } from "@frontier/shared";

function EmptyState() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(36px, 5vw, 64px)",
          color: "rgba(255,255,255,0.08)",
          letterSpacing: "-0.02em",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        Your library awaits.
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--text-4)",
        }}
      >
        Generate projects and save them here
      </div>
    </div>
  );
}

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
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json() as Promise<{ projects: SavedProject[] }>;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/projects/saved/${id}`, {
        method: "DELETE",
        headers: { "x-session-id": sessionId },
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-projects", sessionId] });
    },
  });

  const projects: SavedProject[] = data?.projects ?? [];

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: 48,
            color: "rgba(255,255,255,0.08)",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (projects.length === 0) return <EmptyState />;

  return (
    <div style={{ paddingTop: 112, paddingBottom: 80 }}>
      <div
        style={{
          maxWidth: "82rem",
          margin: "0 auto",
          padding: "0 32px",
          marginBottom: 40,
        }}
      >
        <SectionLabel label={`SAVED LIBRARY · ${projects.length}`} />
      </div>

      {/* Full-bleed grid */}
      <div
        ref={revealRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1px",
          background: "rgba(255,255,255,0.05)", // becomes the grid line color
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {projects.map((project, idx) => {
          const date = new Date(project.createdAt);
          const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={project.id}
              className="reveal-target"
              style={{
                background: "var(--bg)",
                padding: "28px 24px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 220,
                transition: "background 200ms ease",
                animationDelay: `${idx * 40}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface-hover)";
                const btn = e.currentTarget.querySelector(
                  ".del-btn"
                ) as HTMLElement;
                if (btn) {
                  btn.style.opacity = "1";
                  btn.style.transform = "scale(1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg)";
                const btn = e.currentTarget.querySelector(
                  ".del-btn"
                ) as HTMLElement;
                if (btn) {
                  btn.style.opacity = "0";
                  btn.style.transform = "scale(0.8)";
                }
              }}
            >
              {/* Date top-right */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "var(--text-4)",
                }}
              >
                {dateStr}
              </div>

              {/* Main content */}
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: 17,
                    color: "var(--text-1)",
                    lineHeight: 1.35,
                    margin: "0 0 14px",
                    paddingRight: 48,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {project.title}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {project.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-3)",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "var(--r-pill)",
                        padding: "3px 9px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom row: score + delete */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <ScorePill score={project.originalityScore} />

                <button
                  className="del-btn"
                  onClick={() => deleteMutation.mutate(project.id)}
                  disabled={deleteMutation.isPending}
                  style={{
                    background: "none",
                    border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: "var(--r-pill)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(248,113,113,0.5)",
                    cursor: "pointer",
                    opacity: 0,
                    transform: "scale(0.8)",
                    transition: "all 200ms var(--ease-out)",
                    padding: "4px 10px",
                    letterSpacing: "0.1em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--score-red)";
                    e.currentTarget.style.background = "rgba(248,113,113,0.08)";
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(248,113,113,0.5)";
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)";
                  }}
                >
                  REMOVE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}