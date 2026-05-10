import type { ProjectDetail, ProjectPreview, GenerateInput } from "../../../shared/types";
import { downloadMarkdown } from "../../lib/export";

interface Props {
  preview: ProjectPreview;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function PreviewCard({ preview, index, isSelected, onSelect }: Props) {
  // Color determination based on score
  const score = preview.originalityScore;
  let scoreColor = "#F87171"; // red
  let scoreBg = "rgba(248,113,113,0.1)";
  if (score >= 80) {
    scoreColor = "#34D399"; // green
    scoreBg = "rgba(52,211,153,0.1)";
  } else if (score >= 60) {
    scoreColor = "#FBBF24"; // yellow
    scoreBg = "rgba(251,191,36,0.1)";
  }

  return (
    <div
      onClick={onSelect}
      style={{
        width: "min(480px, 85vw)",
        height: 320,
        flexShrink: 0,
        scrollSnapAlign: "start",
        borderRadius: "var(--radius-card)",
        background: "rgba(255,255,255,0.03)",
        border: isSelected ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: 28,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "all 300ms var(--ease-out)",
        boxShadow: isSelected ? "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.15)" : "none",
        transform: isSelected ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.border = "1px solid rgba(59,130,246,0.3)";
          e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      <div>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 22,
          color: "#F0F4FF",
          margin: "0 0 12px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.3,
        }}>
          {preview.title}
        </h3>
        <p style={{
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: 14,
          color: "rgba(255,255,255,0.55)",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.6,
        }}>
          {preview.pitch}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "70%" }}>
          {preview.tags?.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "#94A3B8",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 999,
              padding: "4px 10px",
            }}>
              {tag}
            </span>
          ))}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 700,
            color: scoreColor,
            background: scoreBg,
            padding: "4px 12px",
            borderRadius: 999,
          }}>
            {preview.originalityScore}
          </div>

          <div style={{
            opacity: isSelected ? 1 : 0,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 400,
            textTransform: "uppercase",
            color: "#93C5FD",
            background: "rgba(59,130,246,0.2)",
            border: "1px solid rgba(59,130,246,0.4)",
            borderRadius: 999,
            padding: "4px 12px",
            transition: "opacity 300ms var(--ease-out)",
          }}>
            VIEW SPEC →
          </div>
        </div>
      </div>
    </div>
  );
}