import type { LucideIcon } from "lucide-react";

interface ScorePillProps {
  value: number;
  label: string;
  icon: LucideIcon;
}

export function ScorePill({ value, label, icon: Icon }: ScorePillProps) {
  const color =
    value >= 88 ? "#5BB888" : value >= 75 ? "#C4943A" : "#C94F43";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "10px",
        borderRadius: 10,
        background: `${color}10`,
        border: `1px solid ${color}25`,
        flex: 1,
      }}
    >
      <Icon size={12} color={color} />
      <span
        style={{
          fontSize: 17,
          fontWeight: 700,
          color,
          lineHeight: 1,
          fontFamily: "var(--font-mono)",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 9,
          color: "var(--text-muted)",
          textAlign: "center",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}
