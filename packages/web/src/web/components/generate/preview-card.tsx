/**
 * PreviewCard — Stage-1 preview card with on-demand Stage-2 deep detail.
 */
import { useState, useCallback, useRef } from "react";
import {
  AlertTriangle, Bookmark, BookmarkCheck, ChevronDown, ChevronUp,
  Clock, Cpu, Lightbulb, Loader2, Rocket, TrendingUp,
} from "lucide-react";
import { ScorePill } from "../ui/score-pill";
import { DetailContent } from "./detail-content";
import { getSessionId } from "../../lib/session";
import type { ProjectDetail, ProjectPreview, GenerateInput } from "../../../shared/types";

interface Props {
  preview: ProjectPreview;
  index: number;
  input: GenerateInput;
  isSaved?: boolean;
  isDuplicate?: boolean;
  onSave?: (detail: ProjectDetail | ProjectPreview) => void;
}

const DIFF_COLOR: Record<string, string> = {
  Researcher: "#C94F43",
  Advanced: "#C4943A",
  Intermediate: "#5A7FA8",
  Beginner: "#5BB888",
};

const RESEARCH_COLOR: Record<string, string> = {
  Publishable: "#5BB888",
  Research: "#5A7FA8",
  Startup: "#C4943A",
  Internship: "#7C8DB5",
};

export function PreviewCard({ preview, index, input, isSaved, isDuplicate, onSave }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const detailRef = useRef<ProjectDetail | null>(null);
  const sessionId = getSessionId();

  const loadDetail = useCallback(async () => {
    if (detail || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/generate/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview, input }),
      });
      const data = (await res.json()) as { detail?: ProjectDetail };
      if (data.detail) {
        setDetail(data.detail);
        detailRef.current = data.detail;
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [preview, input, detail, loading]);

  const handleExpand = () => {
    if (!expanded) loadDetail();
    setExpanded((e) => !e);
  };

  const diffColor = DIFF_COLOR[preview.difficulty] ?? "#C4943A";
  const researchColor = RESEARCH_COLOR[preview.researchLevel] ?? "#5A7FA8";

  return (
    <div
      className="project-card"
      style={{
        border: expanded
          ? "1px solid rgba(201,79,67,0.25)"
          : "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        background: "var(--bg-2)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: expanded
          ? "0 0 0 1px rgba(201,79,67,0.08), 0 8px 32px rgba(0,0,0,0.35)"
          : undefined,
        animation: "fadeSlideUp 0.4s ease both",
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 0" }}>
        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 9px",
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                background: `${diffColor}15`,
                border: `1px solid ${diffColor}30`,
                color: diffColor,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
              }}
            >
              <Cpu size={9} />
              {preview.difficulty}
            </span>
            {preview.researchLevel && (
              <span
                style={{
                  padding: "3px 9px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  background: `${researchColor}15`,
                  border: `1px solid ${researchColor}30`,
                  color: researchColor,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {preview.researchLevel}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {preview.timeEstimate && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <Clock size={11} />
                {preview.timeEstimate}
              </span>
            )}
            <button
              onClick={() => onSave?.(detailRef.current ?? preview)}
              aria-label={isSaved ? "Already saved" : "Save project"}
              style={{
                background: "none",
                border: "none",
                cursor: isSaved ? "default" : "pointer",
                color: isSaved || isDuplicate ? "var(--accent)" : "var(--text-muted)",
                padding: 4,
                display: "flex",
                transition: "color 0.15s",
              }}
            >
              {isSaved || isDuplicate ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-display"
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.35,
            margin: "0 0 10px",
          }}
        >
          {preview.title}
        </h3>

        {/* Pitch */}
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: "0 0 14px",
          }}
        >
          {preview.pitch}
        </p>

        {/* Tags */}
        {preview.tags?.length > 0 && (
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}
          >
            {preview.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Scores */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <ScorePill value={preview.recruiterScore} label="Recruiter" icon={TrendingUp} />
          <ScorePill value={preview.originalityScore} label="Originality" icon={Lightbulb} />
          <ScorePill value={preview.startupScore} label="Startup" icon={Rocket} />
        </div>

        {/* Research bottleneck */}
        {preview.researchBottleneck && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 16,
              background: "var(--accent-soft)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
              <AlertTriangle
                size={11}
                color="var(--accent)"
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 11.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {preview.researchBottleneck}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Expand button ───────────────────────────────────────────────────── */}
      <button
        onClick={handleExpand}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          padding: "11px 20px",
          border: "none",
          borderTop: "1px solid var(--border)",
          background: expanded ? "rgba(201,79,67,0.04)" : "transparent",
          color: expanded ? "var(--accent)" : "var(--text-muted)",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.04em",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = expanded
            ? "var(--accent)"
            : "var(--text-secondary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = expanded
            ? "var(--accent)"
            : "var(--text-muted)";
        }}
      >
        {loading ? (
          <>
            <Loader2 size={13} className="spin" />
            LOADING DEEP DETAILS...
          </>
        ) : expanded ? (
          <>
            <ChevronUp size={13} /> COLLAPSE
          </>
        ) : (
          <>
            <ChevronDown size={13} /> DEEP DIVE — ARCHITECTURE & ROADMAP
          </>
        )}
      </button>

      {/* ── Detail panel ────────────────────────────────────────────────────── */}
      {expanded && (
        <div
          style={{
            padding: "20px 20px 24px",
            borderTop: "1px solid var(--border)",
            animation: "fadeSlideUp 0.25s ease both",
          }}
        >
          {loading && !detail && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ width: `${90 - i * 10}%`, height: 13, borderRadius: 4 }}
                />
              ))}
            </div>
          )}

          {error && !detail && (
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              <AlertTriangle
                size={20}
                style={{
                  marginBottom: 8,
                  color: "#C4943A",
                  display: "block",
                  margin: "0 auto 8px",
                }}
              />
              Deep generation failed — rate limited. Try again in a moment.
              <br />
              <button
                onClick={loadDetail}
                style={{
                  marginTop: 10,
                  padding: "6px 14px",
                  borderRadius: 7,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Retry
              </button>
            </div>
          )}

          {detail && <DetailContent detail={detail} />}
        </div>
      )}
    </div>
  );
}
