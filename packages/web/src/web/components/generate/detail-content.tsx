import type { ProjectDetail } from "../../../shared/types";

interface Props {
  detail: ProjectDetail;
}

function SpecHeader({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "40px 0 20px" }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
      }}>
        — {title}
      </div>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "#93C5FD",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      padding: "16px 20px",
      borderRadius: 8,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap",
    }}>
      {children}
    </div>
  );
}

function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "rgba(255,255,255,0.7)",
      lineHeight: 1.8,
      margin: 0,
    }}>
      {children}
    </p>
  );
}

export function DetailContent({ detail }: Props) {
  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Overview */}
      {(detail.problemStatement || detail.coreInnovation) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {detail.problemStatement && (
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase" }}>Problem</div>
              <TextBlock>{detail.problemStatement}</TextBlock>
            </div>
          )}
          {detail.coreInnovation && (
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase" }}>Core Innovation</div>
              <TextBlock>{detail.coreInnovation}</TextBlock>
            </div>
          )}
        </div>
      )}

      {/* Architecture */}
      {detail.architecture && (
        <div>
          <SpecHeader title="Architecture" />
          <CodeBlock>{detail.architecture}</CodeBlock>
        </div>
      )}

      {/* Roadmap Timeline */}
      {detail.roadmap?.length > 0 && (
        <div>
          <SpecHeader title="Roadmap" />
          <div style={{ position: "relative", paddingLeft: 24 }}>
            {/* Vertical Line */}
            <div style={{
              position: "absolute",
              left: 2,
              top: 8,
              bottom: 8,
              width: 2,
              background: "rgba(59,130,246,0.2)",
            }} />
            
            {detail.roadmap.map((step, i) => {
              // Extremely simple heuristic to split out a date/phase label from description if it exists
              // Example: "Week 1-2: Setup environment" -> label: "Week 1-2", desc: "Setup environment"
              const splitIdx = step.indexOf(":");
              let label = `Phase ${i + 1}`;
              let desc = step;
              if (splitIdx > 0 && splitIdx < 30) {
                label = step.substring(0, splitIdx).trim();
                desc = step.substring(splitIdx + 1).trim();
              }

              return (
                <div key={i} style={{ position: "relative", marginBottom: 32 }}>
                  {/* Dot */}
                  <div style={{
                    position: "absolute",
                    left: -25, // -24px padding + 2px line offset - 3px radius
                    top: 6,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3B82F6",
                    boxShadow: "0 0 8px rgba(59,130,246,0.6)",
                  }} />
                  
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 4,
                  }}>
                    {label}
                  </div>
                  <TextBlock>{desc}</TextBlock>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Datasets & Models */}
      {(detail.datasets?.length > 0 || detail.recommendedModels?.length > 0) && (
        <div>
          <SpecHeader title="Data & Models" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {detail.datasets?.length > 0 && (
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase" }}>Datasets</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {detail.datasets.map(d => (
                    <span key={d} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#93C5FD", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 10px", borderRadius: 4 }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {detail.recommendedModels?.length > 0 && (
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase" }}>Models</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {detail.recommendedModels.map(m => (
                    <span key={m} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#93C5FD", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 10px", borderRadius: 4 }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deployment & Scaling */}
      {(detail.deployment || detail.scalingIdeas?.length > 0) && (
        <div>
          <SpecHeader title="Deployment & Scaling" />
          {detail.deployment && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase" }}>Deployment Strategy</div>
              <TextBlock>{detail.deployment}</TextBlock>
            </div>
          )}
          {detail.scalingIdeas?.length > 0 && (
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase" }}>Scaling Ideas</div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {detail.scalingIdeas.map((idea, i) => (
                  <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: 4 }}>
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}