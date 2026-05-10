import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(5,5,15,0.75)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: 52,
      }}
    >
      <div
        style={{
          maxWidth: "80rem", /* 7xl */
          margin: "0 auto",
          padding: "0 24px",
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
              fontSize: 13,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#F0F4FF",
              cursor: "pointer",
            }}
          >
            FRONTIER
          </div>
        </Link>

        {/* Links */}
        <div style={{ display: "flex", gap: 24, alignItems: "center", height: "100%" }}>
          {[
            { href: "/generate", label: "GENERATE" },
            { href: "/companies", label: "COMPANIES" },
            { href: "/trends", label: "TRENDS" },
            { href: "/roadmaps", label: "ROADMAPS" },
            { href: "/saved", label: "LIBRARY" },
          ].map(({ href, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href} style={{ textDecoration: "none", height: "100%" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: active ? "#F0F4FF" : "#F0F4FF",
                    opacity: active ? 1 : 0.4,
                    borderBottom: active ? "1px solid rgba(59,130,246,0.5)" : "1px solid transparent",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.opacity = "0.4";
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
