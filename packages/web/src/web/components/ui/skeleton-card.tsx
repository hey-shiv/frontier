export function SkeletonCard() {
  return (
    <div
      style={{
        width: "min(520px, 88vw)",
        height: 340,
        borderRadius: "var(--r-xl)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        flexShrink: 0,
      }}
    >
      <div className="skeleton" style={{ height: 28, width: "75%", borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 14, width: "95%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: "80%", borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: "60%", borderRadius: 4, marginTop: 4 }} />
      <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
        <div className="skeleton" style={{ height: 26, width: 72, borderRadius: 999 }} />
        <div className="skeleton" style={{ height: 26, width: 60, borderRadius: 999 }} />
        <div className="skeleton" style={{ height: 26, width: 80, borderRadius: 999 }} />
      </div>
    </div>
  );
}