import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SectionLabel } from "../components/section-label";
import { ProviderBadge } from "../components/provider-badge";
import { PreviewCard } from "../components/generate/preview-card";
import { DetailContent } from "../components/generate/detail-content";
import { SkeletonCard } from "../components/ui/skeleton-card";
import { getSessionId } from "../lib/session";
import { useRevealSelf } from "../hooks/use-scroll-reveal";
import type { ProjectPreview, ProjectDetail, GenerateInput } from "../../shared/types";

// ─── Loading Screen ───────────────────────────────────────────────────────────

const LOADING_LINES = [
  "PROFILING YOUR PARAMETERS",
  "QUERYING GEMINI →",
  "SYNTHESIZING PROJECT IDEAS",
  "SCORING ORIGINALITY",
  "RANKING RESULTS",
];

function LoadingScreen() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((i) => (i + 1) % LOADING_LINES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Spinner ring */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1px solid rgba(59,130,246,0.15)",
          borderTop: "1px solid var(--blue)",
          marginBottom: 40,
          animation: "spin 0.9s linear infinite",
        }}
      />

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(40px, 6vw, 72px)",
          color: "rgba(255,255,255,0.1)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: 24,
          userSelect: "none",
        }}
      >
        Generating.
      </div>

      <div
        key={lineIndex}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.3)",
          animation: "fadeIn 0.4s var(--ease-out) both",
        }}
      >
        {LOADING_LINES[lineIndex]}
      </div>
    </div>
  );
}

// ─── Nav Arrow ────────────────────────────────────────────────────────────────

function NavArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.09)",
        background: disabled
          ? "transparent"
          : "rgba(255,255,255,0.04)",
        color: disabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
        fontFamily: "var(--font-mono)",
        fontSize: 15,
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 200ms var(--ease-out)",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.color = "var(--text-1)";
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
          e.currentTarget.style.background = "rgba(59,130,246,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }
      }}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const searchParams = new URLSearchParams(window.location.search);

  const input: GenerateInput = {
    domains: searchParams.getAll("d"),
    interests: searchParams.getAll("i"),
    companies: searchParams.getAll("c"),
    experience: searchParams.get("e") || "Intermediate",
    goal: searchParams.get("g") || "Startup",
    timeCommitment: searchParams.get("t") || "3 months",
    seed: Date.now(),
  };

  const detailRevealRef = useRevealSelf(100);
  const [selectedPreview, setSelectedPreview] = useState<ProjectPreview | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [justSaved, setJustSaved] = useState(false);

  // 1. Previews
  const { data: previewData, isLoading: isLoadingPreviews } = useQuery({
    queryKey: ["generate-previews", input.domains.join(), input.interests.join()],
    queryFn: async () => {
      const res = await fetch("/api/generate/previews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to generate");
      return res.json() as Promise<{
        previews: ProjectPreview[];
        meta: { provider: string; warning?: string };
      }>;
    },
    enabled: input.domains.length > 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (previewData?.previews?.length && !selectedPreview) {
      setSelectedPreview(previewData.previews[0]);
    }
  }, [previewData, selectedPreview]);

  // 2. Detail
  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["generate-detail", selectedPreview?.id],
    queryFn: async () => {
      if (!selectedPreview) return null;
      const res = await fetch("/api/generate/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview: selectedPreview, input }),
      });
      if (!res.ok) throw new Error("Failed to load detail");
      return res.json() as Promise<{ detail: ProjectDetail }>;
    },
    enabled: !!selectedPreview,
    staleTime: Infinity,
  });

  // 3. Save
  const saveMutation = useMutation({
    mutationFn: async (project: ProjectDetail | ProjectPreview) => {
      const res = await fetch("/api/projects/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": getSessionId(),
        },
        body: JSON.stringify({
          ...project,
          inputProfile: input,
          providerMeta: previewData?.meta || {},
        }),
      });
      if (res.status === 409 || res.ok) return { id: project.id };
      throw new Error("Save failed");
    },
    onSuccess: (data) => {
      setSavedIds((prev) => new Set([...prev, data.id]));
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    },
  });

  const handleSave = () => {
    if (detailData?.detail) saveMutation.mutate(detailData.detail);
    else if (selectedPreview) saveMutation.mutate(selectedPreview);
  };

  if (isLoadingPreviews) return <LoadingScreen />;

  const previews = previewData?.previews || [];

  const activeIndex = previews.findIndex((x) => x.id === selectedPreview?.id);
  const currentIndex = activeIndex === -1 ? 0 : activeIndex;

  const navigate = (dir: -1 | 1) => {
    const next = currentIndex + dir;
    if (next >= 0 && next < previews.length) setSelectedPreview(previews[next]);
  };

  const isSaved = selectedPreview ? savedIds.has(selectedPreview.id) : false;

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>

      {/* Section label */}
      <div
        style={{
          maxWidth: "82rem",
          margin: "0 auto",
          padding: "0 32px",
          marginBottom: 48,
        }}
      >
        <SectionLabel
          label={`RESULTS · ${previews.length} PROJECTS`}
          badge={
            previewData?.meta?.provider ? (
              <ProviderBadge provider={previewData.meta.provider} />
            ) : undefined
          }
        />
      </div>

      {/* ── Coverflow Carousel ──────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 420,
          perspective: 1600,
          perspectiveOrigin: "50% 50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {previews.map((p, i) => {
          const offset = i - currentIndex;
          const absOffset = Math.abs(offset);
          const dir = Math.sign(offset) as -1 | 0 | 1;
          const isActive = offset === 0;

          // ── 3D math ──
          const tx = offset * 290;
          const tz = -absOffset * 180;
          const ry = dir * -28;
          const scale = isActive ? 1 : Math.max(0.76, 1 - absOffset * 0.11);
          const opacity = isActive ? 1 : Math.max(0, 1 - absOffset * 0.38);
          const blur = isActive ? 0 : Math.min(6, absOffset * 2.5);
          const zIndex = 30 - absOffset * 2;

          // Only render up to 3 cards each side to save DOM
          if (absOffset > 3) return null;

          return (
            <div
              key={p.id}
              onClick={() => !isActive && setSelectedPreview(p)}
              style={{
                position: "absolute",
                transition: "all 500ms var(--ease-out)",
                transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                zIndex,
                opacity,
                filter: `blur(${blur}px)`,
                cursor: isActive ? "default" : "pointer",
                willChange: "transform, opacity, filter",
              }}
            >
              <PreviewCard
                preview={p}
                index={i}
                isSelected={isActive}
                onSelect={() => setSelectedPreview(p)}
              />
            </div>
          );
        })}
      </div>

      {/* ── Carousel Nav ────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          margin: "28px 0 72px",
        }}
      >
        <NavArrow
          direction="left"
          onClick={() => navigate(-1)}
          disabled={currentIndex === 0}
        />

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {previews.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedPreview(previews[i])}
              style={{
                width: i === currentIndex ? 20 : 5,
                height: 5,
                borderRadius: "var(--r-pill)",
                background: i === currentIndex
                  ? "var(--blue)"
                  : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 350ms var(--ease-out)",
                boxShadow: i === currentIndex ? "var(--glow-sm)" : "none",
              }}
            />
          ))}
        </div>

        <NavArrow
          direction="right"
          onClick={() => navigate(1)}
          disabled={currentIndex === previews.length - 1}
        />
      </div>

      {/* ── Deep Specification ──────────────────────────────────────────── */}
      {selectedPreview && (
        <div
          ref={detailRevealRef as React.RefObject<HTMLDivElement>}
          style={{
            maxWidth: 740,
            margin: "0 auto",
            padding: "0 32px 140px",
          }}
        >
          {/* Top border */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
              marginBottom: 60,
            }}
          />

          <SectionLabel label="DEEP SPECIFICATION" />

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(24px, 3.5vw, 36px)",
              color: "var(--text-1)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 48px",
            }}
          >
            {selectedPreview.title}
          </h2>

          {isLoadingDetail ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="skeleton"
                  style={{ height: n === 1 ? 80 : 16, borderRadius: 6 }}
                />
              ))}
            </div>
          ) : detailData?.detail ? (
            <DetailContent detail={detailData.detail} />
          ) : null}
        </div>
      )}

      {/* ── Sticky Save Button ──────────────────────────────────────────── */}
      {selectedPreview && !isLoadingDetail && (
        <div
          style={{
            position: "fixed",
            bottom: 36,
            right: 36,
            zIndex: 200,
            animation: "fadeUp 0.4s var(--ease-out) both",
          }}
        >
          <button
            onClick={handleSave}
            disabled={isSaved}
            style={{
              height: 44,
              padding: "0 24px",
              borderRadius: "var(--r-pill)",
              border: isSaved
                ? "1px solid rgba(52,211,153,0.3)"
                : "1px solid rgba(99,102,241,0.4)",
              background: isSaved
                ? "rgba(52,211,153,0.1)"
                : "linear-gradient(135deg, var(--blue), var(--indigo))",
              color: isSaved ? "var(--score-green)" : "#fff",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: isSaved ? "default" : "pointer",
              boxShadow: isSaved
                ? "0 0 16px rgba(52,211,153,0.15)"
                : "0 0 32px rgba(59,130,246,0.3), 0 4px 16px rgba(0,0,0,0.4)",
              transition: "all 300ms var(--ease-out)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              if (!isSaved) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 0 48px rgba(99,102,241,0.45), 0 8px 24px rgba(0,0,0,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaved) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 32px rgba(59,130,246,0.3), 0 4px 16px rgba(0,0,0,0.4)";
              }
            }}
            onPointerDown={(e) => {
              if (!isSaved) e.currentTarget.style.transform = "scale(0.96)";
            }}
            onPointerUp={(e) => {
              if (!isSaved) e.currentTarget.style.transform = "translateY(-2px)";
            }}
          >
            <span>{isSaved ? "✓" : "+"}</span>
            <span>{isSaved ? "SAVED TO LIBRARY" : "SAVE TO LIBRARY"}</span>
          </button>
        </div>
      )}
    </div>
  );
}