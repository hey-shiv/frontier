import type { LucideIcon } from "lucide-react";

interface SectionHeadProps {
  icon: LucideIcon;
  label: string;
  color?: string;
}

export function SectionHead({
  icon: Icon,
  label,
  color = "var(--text-muted)",
}: SectionHeadProps) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}
    >
      <Icon size={12} color={color} />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: "var(--font-mono)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
