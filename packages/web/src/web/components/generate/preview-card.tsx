import { ScoreRing } from "../ui/score-ring";
import type { ProjectPreview } from "@frontier/shared";

interface Props {
  preview: ProjectPreview;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function PreviewCard({ preview, index, isSelected, onSelect }: Props) {
  return (
    <div
      onClick={onSelect}
      style={{
        width: "min(520px, 88vw)",
        height: 340,
        flexShrink: 0,
        borderRadius: "var(--r-xl)",
        background: isSelected
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.025)",
        border: isSelected
          ? "1px solid rgba(59,130,246,0.4)"
          : "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "border-color 400ms var(--ease-out), background 400ms var(--ease-out), box-shadow 400ms var(--ease-out)",
        boxShadow: isSelected
          ? "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle inner highlight at top */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: isSelected
            ? "linear-gradient(to right, transparent, rgba(59,130,246,0.4), transparent)"
            : "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
          transition: "all 400ms",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Index indicator */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text-4)",
            letterSpacing: "0.12em",
            marginBottom: 16,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 22,
            color: "var(--text-1)",
            margin: "0 0 14px",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {preview.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: 14,
            color: "rgba(255,255,255,0.48)",
            margin: 0,
            lineHeight: 1.65,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {preview.pitch}
        </p>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "65%" }}>
          {preview.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--text-3)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "var(--r-pill)",
                padding: "4px 10px",
                letterSpacing: "0.04em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Score + View Spec */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <ScoreRing score={preview.originalityScore} animated={isSelected} />

          <div
            style={{
              opacity: isSelected ? 1 : 0,
              transform: isSelected ? "translateY(0)" : "translateY(4px)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#93C5FD",
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: "var(--r-pill)",
              padding: "4px 12px",
              transition: "all 300ms var(--ease-out)",
              whiteSpace: "nowrap",
            }}
          >
            VIEW SPEC →
          </div>
        </div>
      </div>
    </div>
  );
}