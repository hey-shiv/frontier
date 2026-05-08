import { Link, useLocation } from "wouter";
import { Cpu, Bookmark, TrendingUp, Map, Building2, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/roadmaps", label: "Roadmaps", icon: Map },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        background: "rgba(12, 12, 12, 0.85)",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 28px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 14px rgba(201,79,67,0.45)",
              }}
            >
              <Cpu size={14} color="white" />
            </div>
            <span
              className="font-display"
              style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              Frontier
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 1 }} className="desktop-nav">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} to={href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 13px",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    background: active ? "rgba(255,255,255,0.06)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLDivElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLDivElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <Icon size={13} />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link to="/generate" style={{ textDecoration: "none" }}>
            <button
              className="btn-accent"
              style={{ padding: "7px 16px", borderRadius: 7, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
            >
              <Sparkles size={12} />
              Generate
            </button>
          </Link>

          <button
            onClick={() => setOpen(!open)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "none",
              padding: 4,
            }}
            className="mobile-menu-btn"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "10px 20px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            background: "rgba(12,12,12,0.97)",
          }}
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link key={href} to={href} style={{ textDecoration: "none" }} onClick={() => setOpen(false)}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 7,
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    background: active ? "rgba(255,255,255,0.05)" : "transparent",
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <Icon size={15} />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
