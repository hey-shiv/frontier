interface TagListProps {
  items: string[];
  color?: string;
}

export function TagList({ items, color }: TagListProps) {
  if (!items?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            padding: "3px 9px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            background: color ? `${color}0F` : "rgba(255,255,255,0.04)",
            border: color
              ? `1px solid ${color}22`
              : "1px solid var(--border)",
            color: color ?? "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
