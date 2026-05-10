import type { ReactNode } from "react";

interface Props {
  label: string;
  badge?: ReactNode;
  className?: string;
}

export function SectionLabel({ label, badge, className }: Props) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 40,
      }}
    >
      {/* Em-dash line */}
      <div
        style={{
          width: 24,
          height: 1,
          background: "rgba(255,255,255,0.25)",
          flexShrink: 0,
          animation: "revealLine 0.6s var(--ease-out) both",
        }}
      />
      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.35)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      {/* Optional badge */}
      {badge && <span style={{ marginLeft: 4 }}>{badge}</span>}
    </div>
  );
}