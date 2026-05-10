export function SectionLabel({ label, badge }: { label: string; badge?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.3)" }} />
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.4)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {label}
        {badge && badge}
      </div>
    </div>
  );
}