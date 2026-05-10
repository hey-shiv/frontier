import { useCountUp } from "../../hooks/use-count-up";

interface Props {
  score: number;
  size?: number;
  animated?: boolean;
}

function getScoreTokens(score: number) {
  if (score >= 80) return { color: "var(--score-green)", bg: "var(--score-green-bg)", ring: "var(--score-green-ring)" };
  if (score >= 60) return { color: "var(--score-yellow)", bg: "var(--score-yellow-bg)", ring: "var(--score-yellow-ring)" };
  return { color: "var(--score-red)", bg: "var(--score-red-bg)", ring: "var(--score-red-ring)" };
}

export function ScoreRing({ score, size = 52, animated = true }: Props) {
  const displayed = useCountUp(score, 800, animated);
  const tokens = getScoreTokens(score);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: tokens.bg,
        border: `1px solid ${tokens.ring}`,
        boxShadow: `0 0 0 3px ${tokens.bg}, 0 0 16px ${tokens.ring}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        animation: animated ? "scoreCount 0.5s var(--ease-out) both" : "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: size > 40 ? 14 : 11,
          fontWeight: 700,
          color: tokens.color,
          letterSpacing: "-0.03em",
        }}
      >
        {displayed}
      </span>
    </div>
  );
}

/** Compact pill version for the library grid */
export function ScorePill({ score }: { score: number }) {
  const tokens = getScoreTokens(score);
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 700,
        color: tokens.color,
        background: tokens.bg,
        border: `1px solid ${tokens.ring}`,
        borderRadius: "var(--r-pill)",
        padding: "3px 10px",
        boxShadow: `0 0 8px ${tokens.ring}`,
      }}
    >
      {score}
    </span>
  );
}