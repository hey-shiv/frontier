interface Props {
  provider: string;
}

export function ProviderBadge({ provider }: Props) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.05em",
        color: "#93C5FD",
        background: "rgba(59,130,246,0.1)",
        border: "1px solid rgba(59,130,246,0.22)",
        borderRadius: "var(--r-sm)",
        padding: "2px 8px",
      }}
    >
      [{provider}]
    </span>
  );
}