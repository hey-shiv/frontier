import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SectionLabel } from "../components/section-label";
import { PreviewCard } from "../components/generate/preview-card";
import { DetailContent } from "../components/generate/detail-content";
import { getSessionId } from "../lib/session";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import type { ProjectPreview, ProjectDetail, GenerateInput, LLMProvider } from "../../shared/types";

export default function GeneratePage() {
  const [location] = useLocation();
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

  const revealRef = useScrollReveal();
  const [selectedPreview, setSelectedPreview] = useState<ProjectPreview | null>(null);

  // 1. Fetch Previews
  const { data: previewData, isLoading: isLoadingPreviews } = useQuery({
    queryKey: ["generate-previews", input.domains.join(), input.interests.join()],
    queryFn: async () => {
      const res = await fetch("/api/generate/previews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to generate");
      return res.json() as Promise<{ previews: ProjectPreview[]; meta: { provider: string; warning?: string } }>;
    },
    enabled: input.domains.length > 0,
    staleTime: Infinity,
  });

  // Automatically select the first preview when loaded
  useEffect(() => {
    if (previewData?.previews && previewData.previews.length > 0 && !selectedPreview) {
      setSelectedPreview(previewData.previews[0]);
    }
  }, [previewData, selectedPreview]);

  // 2. Fetch Detail for selected
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

  // 3. Save Mutation
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const saveMutation = useMutation({
    mutationFn: async (project: ProjectDetail | ProjectPreview) => {
      const res = await fetch("/api/projects/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": getSessionId(),
        },
        body: JSON.stringify({ ...project, inputProfile: input, providerMeta: previewData?.meta || {} }),
      });
      if (res.status === 409 || res.ok) return { id: project.id };
      throw new Error(`Save failed`);
    },
    onSuccess: (data) => {
      setSavedIds(prev => new Set([...prev, data.id]));
    },
  });

  const handleSave = () => {
    if (detailData?.detail) saveMutation.mutate(detailData.detail);
    else if (selectedPreview) saveMutation.mutate(selectedPreview);
  };

  if (isLoadingPreviews) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: 72,
          color: "rgba(255,255,255,0.15)",
          marginBottom: 16,
        }}>
          Generating...
        </div>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}>
          QUERYING PROVIDER CHAIN →
        </div>
      </div>
    );
  }

  const previews = previewData?.previews || [];
  const providerBadge = previewData?.meta?.provider ? (
    <span style={{
      background: "rgba(59,130,246,0.12)",
      border: "1px solid rgba(59,130,246,0.25)",
      borderRadius: 4,
      padding: "2px 8px",
      color: "#93C5FD",
      textTransform: "lowercase",
    }}>
      [{previewData.meta.provider}]
    </span>
  ) : null;

  return (
    <div style={{ paddingTop: 120, minHeight: "100vh" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", paddingLeft: 24, paddingRight: 24, marginBottom: 24 }}>
        <SectionLabel label={`RESULTS · ${previews.length} PROJECTS`} badge={providerBadge} />
      </div>

      {/* 3D Coverflow Carousel */}
      <div 
        style={{
          position: "relative",
          width: "100%",
          height: 440,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1400,
          overflow: "hidden",
          margin: "0 auto 20px",
        }}
      >
        {previews.map((p, i) => {
          const activeIndex = previews.findIndex(x => x.id === selectedPreview?.id);
          const currentIdx = activeIndex === -1 ? 0 : activeIndex;
          const offset = i - currentIdx;
          const absOffset = Math.abs(offset);
          const direction = Math.sign(offset);

          const isActive = offset === 0;

          // Cinematic Math
          const translateX = offset * 260; // horizontal spread
          const translateZ = absOffset * -60; // push back into screen
          const rotateY = direction * -25; // tilt towards center
          const scale = isActive ? 1 : Math.max(0.88, 1 - (absOffset * 0.12));
          const zIndex = 20 - absOffset;
          const opacity = isActive ? 1 : Math.max(0.35, 1 - (absOffset * 0.4));
          const blur = isActive ? 0 : Math.min(2, absOffset * 2);

          return (
            <div
              key={p.id}
              onClick={() => setSelectedPreview(p)}
              style={{
                position: "absolute",
                transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                cursor: isActive ? "default" : "pointer",
                filter: `blur(${blur}px)`,
              }}
            >
              <div style={{ pointerEvents: isActive ? "auto" : "none" }}>
                 <PreviewCard 
                    preview={p} 
                    index={i} 
                    isSelected={isActive}
                    onSelect={() => setSelectedPreview(p)}
                  />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginBottom: 60, display: "flex", justifyContent: "center", gap: 24, alignItems: "center" }}>
          <button 
             onClick={() => {
                const idx = previews.findIndex(x => x.id === selectedPreview?.id);
                if (idx > 0) setSelectedPreview(previews[idx - 1]);
             }}
             style={{ 
               background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", 
               width: 36, height: 36, borderRadius: 18, cursor: "pointer", transition: "all 0.2s ease",
               display: "flex", alignItems: "center", justifyContent: "center",
               fontFamily: "var(--font-mono)", fontSize: 16
             }}
             onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
             onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >←</button>
          
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.1em"
          }}>
            CLICK ADJACENT CARDS OR ARROWS TO BROWSE
          </span>
          
          <button 
             onClick={() => {
                const idx = previews.findIndex(x => x.id === selectedPreview?.id);
                if (idx < previews.length - 1) setSelectedPreview(previews[idx + 1]);
             }}
             style={{ 
               background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", 
               width: 36, height: 36, borderRadius: 18, cursor: "pointer", transition: "all 0.2s ease",
               display: "flex", alignItems: "center", justifyContent: "center",
               fontFamily: "var(--font-mono)", fontSize: 16
             }}
             onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
             onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >→</button>
      </div>

      {/* Detail Spec */}
      {selectedPreview && (
        <div ref={revealRef} style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 120px 24px" }}>
          <SectionLabel label="DEEP SPECIFICATION" />
          
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 28,
            color: "#F0F4FF",
            margin: "0 0 40px",
          }}>
            {selectedPreview.title}
          </h2>

          {isLoadingDetail ? (
            <div style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
              Expanding specification...
            </div>
          ) : detailData?.detail ? (
            <DetailContent detail={detailData.detail} />
          ) : null}
        </div>
      )}

      {/* Sticky Save Button */}
      {selectedPreview && !isLoadingDetail && (
        <div style={{ position: "fixed", bottom: 40, right: 40, zIndex: 100 }}>
          <button
            onClick={handleSave}
            disabled={savedIds.has(selectedPreview.id)}
            style={{
              background: savedIds.has(selectedPreview.id) ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #3B82F6, #6366F1)",
              color: savedIds.has(selectedPreview.id) ? "rgba(255,255,255,0.5)" : "#fff",
              border: "none",
              borderRadius: 999,
              padding: "12px 24px",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              cursor: savedIds.has(selectedPreview.id) ? "default" : "pointer",
              boxShadow: savedIds.has(selectedPreview.id) ? "none" : "0 0 24px rgba(59,130,246,0.3)",
              transition: "all 200ms var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              if (!savedIds.has(selectedPreview.id)) e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseLeave={(e) => {
              if (!savedIds.has(selectedPreview.id)) e.currentTarget.style.filter = "brightness(1)";
            }}
            onPointerDown={(e) => {
              if (!savedIds.has(selectedPreview.id)) e.currentTarget.style.transform = "scale(0.95)";
            }}
            onPointerUp={(e) => {
              if (!savedIds.has(selectedPreview.id)) e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {savedIds.has(selectedPreview.id) ? "SAVED TO LIBRARY ✓" : "SAVE TO LIBRARY"}
          </button>
        </div>
      )}
    </div>
  );
}