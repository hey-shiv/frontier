import { Link } from "wouter";
import { ArrowRight, Sparkles, Building2, TrendingUp, Map, Zap, Target, Brain, Code2, ChevronDown } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Project Generator",
    description: "Select your domains and interests. Get frontier-level project ideas personalized to your goals and target companies.",
    tag: "Core Feature",
  },
  {
    icon: Building2,
    title: "Company Intelligence",
    description: "Deep profiles of top AI companies — research directions, tech stacks, and open roles you should be targeting.",
    tag: "Research",
  },
  {
    icon: TrendingUp,
    title: "Research Trends",
    description: "Stay ahead with live intelligence on trending papers, frameworks, and emerging AI technologies.",
    tag: "Live Data",
  },
  {
    icon: Map,
    title: "Career Roadmaps",
    description: "Step-by-step paths to ML Engineer, AI Researcher, or Startup Founder — with resources and milestones.",
    tag: "Guidance",
  },
];

const steps = [
  {
    step: "01",
    icon: Target,
    title: "Build Your Profile",
    desc: "Pick AI domains, personal interests, target companies, and your experience level.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Generates Ideas",
    desc: "Our engine fuses your selections with live research trends and company intelligence.",
  },
  {
    step: "03",
    icon: Code2,
    title: "Ship Your Project",
    desc: "Full specs — architecture, datasets, APIs, deployment, and implementation roadmap.",
  },
];

const stats = [
  { value: "50+", label: "AI Companies" },
  { value: "4s", label: "Avg generation" },
  { value: "100+", label: "Project templates" },
  { value: "Free", label: "Always" },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Hero ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: 58,
      }}>

        {/* Grid */}
        <div className="grid-texture" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5 }} />

        {/* Bottom warm glow */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "90%", height: 380,
          background: "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(201,79,67,0.16) 0%, rgba(150,50,42,0.05) 55%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Ambient center orb */}
        <div className="orb pulse-glow" style={{
          position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
          width: 500, height: 360,
          background: "radial-gradient(circle, rgba(201,79,67,0.055) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, padding: "0 28px" }}>

          {/* Badge */}
          <div className="fade-up section-label" style={{ display: "inline-flex" }}>
            <span className="live-dot" />
            AI Career Intelligence Platform
          </div>

          {/* Headline */}
          <h1
            className="font-display fade-up delay-100"
            style={{
              fontSize: "clamp(46px, 7.5vw, 88px)",
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              margin: "0 0 28px",
            }}
          >
            Build Projects{" "}
            <span className="serif-italic" style={{ fontWeight: 400, letterSpacing: "-0.02em" }}>Frontier</span>
            <br />
            AI Labs{" "}
            <span className="serif-gradient">Actually Want</span>
          </h1>

          <p
            className="fade-up delay-200"
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              margin: "0 auto 48px",
              maxWidth: 520,
              fontWeight: 400,
            }}
          >
            Personalized AI project recommendations powered by live research trends,
            company intelligence, and your personal interests.
          </p>

          {/* CTAs */}
          <div className="fade-up delay-300" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/generate" style={{ textDecoration: "none" }}>
              <button className="btn-accent" style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "13px 28px", borderRadius: 9, fontSize: 14, fontWeight: 600,
              }}>
                Generate My Projects
                <ArrowRight size={15} />
              </button>
            </Link>
            <Link to="/companies" style={{ textDecoration: "none" }}>
              <button className="btn-ghost" style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "13px 28px", borderRadius: 9, fontSize: 14,
              }}>
                <Building2 size={14} />
                Explore Companies
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="fade-up delay-400" style={{
            display: "flex", gap: 0, justifyContent: "center", marginTop: 64,
            borderTop: "1px solid var(--border)", paddingTop: 40,
          }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                padding: "0 36px",
                borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
                textAlign: "center",
              }}>
                <div className="font-display" style={{
                  fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800,
                  letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="fade-up delay-600" style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.25,
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            scroll
          </span>
          <ChevronDown size={13} color="var(--text-muted)" />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: "var(--section-gap) 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 520, marginBottom: 72 }}>
          <div className="section-label" style={{ display: "inline-flex" }}>
            <span className="live-dot" />
            Process
          </div>
          <h2 className="font-display" style={{
            fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800,
            letterSpacing: "-0.035em", lineHeight: 1.05, margin: "0 0 20px",
          }}>
            From interests to{" "}
            <span className="serif-italic" style={{ fontWeight: 400 }}>frontier</span>
            <br />
            projects.
          </h2>
          <p className="prose">
            Three steps to discover your next recruiter-impressive AI project.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderLeft: "1px solid var(--border)" }} className="steps-grid">
          {steps.map((step, idx) => (
            <div key={step.step} style={{
              padding: "44px 40px",
              borderTop: "1px solid var(--border)",
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              position: "relative",
              transition: "background 0.22s ease",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.012)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <div style={{
                fontSize: 11, fontWeight: 500, color: "var(--accent)",
                fontFamily: "var(--font-mono)", marginBottom: 32,
                letterSpacing: "0.06em",
              }}>
                {step.step}
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "rgba(201,79,67,0.08)", border: "1px solid rgba(201,79,67,0.16)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}>
                <step.icon size={16} color="var(--accent)" />
              </div>
              <h3 className="font-display" style={{
                fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em",
                margin: "0 0 12px", lineHeight: 1.2,
              }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "0 24px var(--section-gap)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 64 }}>
          <div style={{ maxWidth: 480 }}>
            <div className="section-label" style={{ display: "inline-flex" }}>
              <span className="live-dot" />
              Features
            </div>
            <h2 className="font-display" style={{
              fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800,
              letterSpacing: "-0.035em", lineHeight: 1.05, margin: "0 0 16px",
            }}>
              Everything to{" "}
              <span className="serif-gradient">stand out.</span>
            </h2>
            <p className="prose">
              The complete career intelligence platform for AI engineers and researchers.
            </p>
          </div>
          <Link to="/generate" style={{ textDecoration: "none" }}>
            <button className="btn-ghost" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 22px", borderRadius: 8, fontSize: 13,
            }}>
              Get started
              <ArrowRight size={13} />
            </button>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "var(--border)" }} className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="card-hover" style={{
              padding: "40px 36px",
              background: "var(--bg-2)",
              cursor: "default",
              border: "none",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 500, color: "var(--accent)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                marginBottom: 20, fontFamily: "var(--font-mono)",
              }}>
                {f.tag}
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: 8,
                background: "rgba(201,79,67,0.07)", border: "1px solid rgba(201,79,67,0.14)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}>
                <f.icon size={17} color="var(--accent)" />
              </div>
              <h3 className="font-display" style={{
                fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em",
                margin: "0 0 10px",
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 24px var(--section-gap)", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", height: 500,
          background: "radial-gradient(ellipse 50% 80% at 50% 100%, rgba(201,79,67,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: 900, margin: "0 auto",
          padding: "80px 60px",
          borderRadius: 18,
          border: "1px solid rgba(201,79,67,0.16)",
          background: "linear-gradient(160deg, rgba(201,79,67,0.055) 0%, transparent 60%)",
          position: "relative", overflow: "hidden",
          textAlign: "center",
        }}>
          {/* Ambient orb */}
          <div className="orb" style={{
            position: "absolute", top: -80, right: -80,
            width: 280, height: 280,
            background: "radial-gradient(circle, rgba(201,79,67,0.18) 0%, transparent 70%)",
          }} />

          <div className="section-label" style={{ display: "inline-flex", marginBottom: 28 }}>
            <span className="live-dot" />
            Get started
          </div>

          <h2 className="font-display" style={{
            fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 1.0,
            margin: "0 0 8px",
          }}>
            Take the next step
          </h2>
          <h2 className="font-display" style={{
            fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 1.0,
            margin: "0 0 24px",
          }}>
            <span className="serif-gradient">today.</span>
          </h2>

          <p style={{
            fontSize: "clamp(14px, 1.5vw, 16px)",
            color: "var(--text-secondary)", lineHeight: 1.8,
            margin: "0 auto 40px", maxWidth: 440,
          }}>
            Build projects that get noticed at OpenAI, DeepMind,
            Anthropic, and beyond.
          </p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            {["Research-Grade Projects", "Company Intelligence", "Live Trends"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                <span style={{
                  width: 15, height: 15, borderRadius: "50%",
                  background: "rgba(201,79,67,0.12)", border: "1px solid rgba(201,79,67,0.3)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", display: "block" }} />
                </span>
                {item}
              </div>
            ))}
          </div>

          <Link to="/generate" style={{ textDecoration: "none" }}>
            <button className="btn-accent" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "14px 32px", borderRadius: 9, fontSize: 14, fontWeight: 600,
            }}>
              Generate My Projects
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={11} color="white" />
            </div>
            <span className="font-display" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>Frontier</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
            AI Career Intelligence Platform · Built for frontier engineers
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
