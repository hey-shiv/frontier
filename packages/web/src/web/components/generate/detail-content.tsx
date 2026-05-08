/**
 * DetailContent — expanded deep-dive panel for a project card.
 * Rendered inside PreviewCard when the user clicks "Deep Dive".
 */
import {
  AlertTriangle, Lightbulb, Cpu, Code2, Brain, Layers, Database,
  Globe, TrendingUp, BookOpen, BarChart3, FlaskConical, Star,
} from "lucide-react";
import { SectionHead } from "../ui/section-head";
import { TagList } from "../ui/tag-list";
import type { ProjectDetail } from "../../../shared/types";

interface Props {
  detail: ProjectDetail;
}

export function DetailContent({ detail }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Problem + Innovation */}
      {(detail.problemStatement || detail.coreInnovation) && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          className="detail-grid"
        >
          {detail.problemStatement && (
            <div
              style={{
                padding: "14px",
                borderRadius: 10,
                background: "rgba(201,79,67,0.04)",
                border: "1px solid rgba(201,79,67,0.12)",
              }}
            >
              <SectionHead icon={AlertTriangle} label="Problem" color="#C94F43" />
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {detail.problemStatement}
              </p>
            </div>
          )}
          {detail.coreInnovation && (
            <div
              style={{
                padding: "14px",
                borderRadius: 10,
                background: "rgba(91,184,136,0.04)",
                border: "1px solid rgba(91,184,136,0.15)",
              }}
            >
              <SectionHead icon={Lightbulb} label="Core Innovation" color="#5BB888" />
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {detail.coreInnovation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Architecture */}
      {detail.architecture && (
        <div>
          <SectionHead icon={Cpu} label="Architecture" color="var(--accent)" />
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            {detail.architecture}
          </div>
        </div>
      )}

      {/* Tech Stack + Skills */}
      {(detail.techStack?.length > 0 || detail.requiredSkills?.length > 0) && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          className="detail-grid"
        >
          {detail.techStack?.length > 0 && (
            <div>
              <SectionHead icon={Code2} label="Tech Stack" />
              <TagList items={detail.techStack} />
            </div>
          )}
          {detail.requiredSkills?.length > 0 && (
            <div>
              <SectionHead icon={Brain} label="Required Skills" />
              <TagList items={detail.requiredSkills} />
            </div>
          )}
        </div>
      )}

      {/* Datasets + Models */}
      {(detail.datasets?.length > 0 || detail.recommendedModels?.length > 0) && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          className="detail-grid"
        >
          {detail.datasets?.length > 0 && (
            <div>
              <SectionHead icon={Database} label="Datasets" />
              <TagList items={detail.datasets} />
            </div>
          )}
          {detail.recommendedModels?.length > 0 && (
            <div>
              <SectionHead icon={Layers} label="Models" />
              <TagList items={detail.recommendedModels} />
            </div>
          )}
        </div>
      )}

      {/* Evaluation metrics */}
      {detail.evaluationMetrics?.length > 0 && (
        <div>
          <SectionHead icon={BarChart3} label="Evaluation Metrics" />
          <TagList items={detail.evaluationMetrics} />
        </div>
      )}

      {/* Roadmap */}
      {detail.roadmap?.length > 0 && (
        <div>
          <SectionHead icon={BookOpen} label="Roadmap" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {detail.roadmap.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--accent-soft)",
                    border: "1px solid var(--accent-border)",
                    color: "var(--accent)",
                    fontSize: 9,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployment + Scaling */}
      {(detail.deployment || detail.scalingIdeas?.length > 0) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              detail.deployment && detail.scalingIdeas?.length ? "1fr 1fr" : "1fr",
            gap: 12,
          }}
          className="detail-grid"
        >
          {detail.deployment && (
            <div>
              <SectionHead icon={Globe} label="Deployment" />
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {detail.deployment}
              </p>
            </div>
          )}
          {detail.scalingIdeas?.length > 0 && (
            <div>
              <SectionHead icon={TrendingUp} label="Scaling Ideas" />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {detail.scalingIdeas.map((idea, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--accent)", fontSize: 12, marginTop: 1 }}>
                      →
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {idea}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Future improvements */}
      {detail.futureImprovements?.length > 0 && (
        <div>
          <SectionHead icon={FlaskConical} label="Future Research Directions" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {detail.futureImprovements.map((item, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  background: "rgba(91,137,168,0.08)",
                  border: "1px solid rgba(91,137,168,0.2)",
                  color: "#7CA8C8",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Target companies */}
      {detail.targetCompanies?.length > 0 && (
        <div>
          <SectionHead icon={Star} label="Target Companies" />
          <TagList items={detail.targetCompanies} />
        </div>
      )}
    </div>
  );
}
