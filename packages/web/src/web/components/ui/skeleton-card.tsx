interface SkeletonCardProps {
  index: number;
}

export function SkeletonCard({ index }: SkeletonCardProps) {
  return (
    <div
      className="project-card"
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        background: "var(--bg-2)",
        padding: 24,
        animation: "fadeSlideUp 0.4s ease both",
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Top bar */}
      <div
        style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}
      >
        <div className="skeleton" style={{ width: 80, height: 22, borderRadius: 999 }} />
        <div className="skeleton" style={{ width: 56, height: 22, borderRadius: 999 }} />
      </div>
      {/* Title */}
      <div
        className="skeleton"
        style={{ width: "85%", height: 22, borderRadius: 6, marginBottom: 10 }}
      />
      <div
        className="skeleton"
        style={{ width: "60%", height: 22, borderRadius: 6, marginBottom: 20 }}
      />
      {/* Pitch */}
      <div
        className="skeleton"
        style={{ width: "100%", height: 14, borderRadius: 4, marginBottom: 8 }}
      />
      <div
        className="skeleton"
        style={{ width: "75%", height: 14, borderRadius: 4, marginBottom: 20 }}
      />
      {/* Score pills */}
      <div style={{ display: "flex", gap: 8 }}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ flex: 1, height: 58, borderRadius: 10 }}
          />
        ))}
      </div>
    </div>
  );
}
