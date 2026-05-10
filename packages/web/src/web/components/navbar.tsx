import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/",         label: "HOME"      },
  { href: "/generate", label: "GENERATE"  },
  { href: "/companies",label: "COMPANIES" },
  { href: "/trends",   label: "TRENDS"    },
  { href: "/roadmaps", label: "ROADMAPS"  },
  { href: "/saved",    label: "LIBRARY"   },
];

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 56,
        background: scrolled
          ? "rgba(4, 4, 14, 0.88)"
          : "rgba(4, 4, 14, 0.6)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)"}`,
        transition: "background 300ms ease, border-color 300ms ease",
      }}
    >
      <div
        style={{
          maxWidth: "82rem",
          margin: "0 auto",
          padding: "0 32px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.35em",
              color: "var(--text-1)",
              cursor: "pointer",
              transition: "text-shadow 300ms ease",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(59,130,246,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "none";
            }}
          >
            FRONTIER
          </div>
        </Link>

        {/* Links */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    position: "relative",
                    padding: "6px 12px",
                    borderRadius: "var(--r-sm)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: isActive ? "var(--text-1)" : "var(--text-3)",
                    background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                    border: isActive
                      ? "1px solid rgba(59,130,246,0.18)"
                      : "1px solid transparent",
                    transition: "all 200ms var(--ease-out)",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-3)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}