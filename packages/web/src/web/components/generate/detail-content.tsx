import type { ProjectDetail } from "@frontier/shared";

// ─── Internal components ──────────────────────────────────────────────────────

function SpecHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        margin: "56px 0 24px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--text-3)",
          whiteSpace: "nowrap",
        }}
      >
        — {title}
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background:
            "linear-gradient(to right, rgba(255,255,255,0.07), transparent)",
        }}
      />
    </div>
  );
}

function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 15,
        fontWeight: 400,
        color: "rgba(255,255,255,0.62)",
        lineHeight: 1.85,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "var(--text-4)",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "#93C5FD",
        background: "rgba(59,130,246,0.05)",
        border: "1px solid rgba(59,130,246,0.12)",
        borderLeft: "3px solid rgba(59,130,246,0.4)",
        padding: "20px 24px",
        borderRadius: "0 var(--r-md) var(--r-md) 0",
        lineHeight: 1.75,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {children}
    </div>
  );
}

function TagCloud({
  items,
  accent = false,
}: {
  items: string[];
  accent?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((item) => (
        <span
          key={item}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: accent ? "#93C5FD" : "var(--text-2)",
            background: accent
              ? "rgba(59,130,246,0.08)"
              : "rgba(255,255,255,0.03)",
            border: accent
              ? "1px solid rgba(59,130,246,0.18)"
              : "1px solid var(--border-subtle)",
            padding: "5px 12px",
            borderRadius: "var(--r-sm)",
            letterSpacing: "0.04em",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DetailContent({ detail }: { detail: ProjectDetail }) {
  return (
    <div>
      {/* Problem & Innovation */}
      {(detail.problemStatement || detail.coreInnovation) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {detail.problemStatement && (
            <div>
              <MiniLabel>Problem</MiniLabel>
              <TextBlock>{detail.problemStatement}</TextBlock>
            </div>
          )}
          {detail.coreInnovation && (
            <div>
              <MiniLabel>Core Innovation</MiniLabel>
              <TextBlock>{detail.coreInnovation}</TextBlock>
            </div>
          )}
          {detail.whyItMatters && (
            <div>
              <MiniLabel>Why It Matters</MiniLabel>
              <TextBlock>{detail.whyItMatters}</TextBlock>
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

      {/* Roadmap */}
      {detail.roadmap?.length > 0 && (
        <div>
          <SpecHeader title="Roadmap" />
          <div style={{ position: "relative", paddingLeft: 28 }}>
            {/* Vertical gradient line */}
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 10,
                bottom: 10,
                width: 2,
                background:
                  "linear-gradient(to bottom, var(--blue), rgba(59,130,246,0.08))",
                borderRadius: 2,
              }}
            />

            {detail.roadmap.map((step, i) => {
              const splitIdx = step.indexOf(":");
              let label = `Phase ${i + 1}`;
              let desc = step;
              if (splitIdx > 0 && splitIdx < 35) {
                label = step.substring(0, splitIdx).trim();
                desc = step.substring(splitIdx + 1).trim();
              }

              return (
                <div
                  key={i}
                  style={{ position: "relative", marginBottom: 36 }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: -29,
                      top: 5,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--blue)",
                      border: "2px solid rgba(59,130,246,0.2)",
                      boxShadow: "0 0 0 4px rgba(59,130,246,0.08), 0 0 12px rgba(59,130,246,0.4)",
                    }}
                  />

                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--text-3)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </div>
                  <TextBlock>{desc}</TextBlock>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {detail.techStack?.length > 0 && (
        <div>
          <SpecHeader title="Tech Stack" />
          <TagCloud items={detail.techStack} />
        </div>
      )}

      {/* Data & Models */}
      {(detail.datasets?.length > 0 || detail.recommendedModels?.length > 0) && (
        <div>
          <SpecHeader title="Data & Models" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {detail.datasets?.length > 0 && (
              <div>
                <MiniLabel>Datasets</MiniLabel>
                <TagCloud items={detail.datasets} accent />
              </div>
            )}
            {detail.recommendedModels?.length > 0 && (
              <div>
                <MiniLabel>Models</MiniLabel>
                <TagCloud items={detail.recommendedModels} accent />
              </div>
            )}
          </div>
        </div>
      )}

      {/* APIs */}
      {detail.apis?.length > 0 && (
        <div>
          <SpecHeader title="APIs & Services" />
          <TagCloud items={detail.apis} />
        </div>
      )}

      {/* Evaluation */}
      {detail.evaluationMetrics?.length > 0 && (
        <div>
          <SpecHeader title="Evaluation Metrics" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {detail.evaluationMetrics.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "12px 16px",
                  background: "var(--surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--r-sm)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text-4)",
                    paddingTop: 2,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <TextBlock>{m}</TextBlock>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployment */}
      {(detail.deployment || detail.scalingIdeas?.length > 0) && (
        <div>
          <SpecHeader title="Deployment & Scaling" />
          {detail.deployment && (
            <div style={{ marginBottom: 28 }}>
              <MiniLabel>Strategy</MiniLabel>
              <TextBlock>{detail.deployment}</TextBlock>
            </div>
          )}
          {detail.scalingIdeas?.length > 0 && (
            <div>
              <MiniLabel>Scaling Ideas</MiniLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {detail.scalingIdeas.map((idea, i) => (
                  <div
                    key={i}
                    style={{
                      paddingLeft: 16,
                      borderLeft: "2px solid rgba(59,130,246,0.2)",
                    }}
                  >
                    <TextBlock>{idea}</TextBlock>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Required Skills */}
      {detail.requiredSkills?.length > 0 && (
        <div>
          <SpecHeader title="Required Skills" />
          <TagCloud items={detail.requiredSkills} />
        </div>
      )}

      {/* Future */}
      {detail.futureImprovements?.length > 0 && (
        <div>
          <SpecHeader title="Future Improvements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {detail.futureImprovements.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--blue)",
                    paddingTop: 3,
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
                <TextBlock>{item}</TextBlock>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: 60 }} />
    </div>
  );
}