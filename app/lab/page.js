"use client";

import React, { useState, useEffect, useMemo } from "react";

// --- shared squiggle generation, but parameterized for different lengths/styles ---
function buildSquigglePath(width, height, segments, peaks, bodyEnd = 0.86, ampMul = 1) {
  const pts = [];
  const midY = height / 2;
  const amp = height * 0.28 * ampMul;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    if (t <= bodyEnd) {
      const u = t / bodyEnd;
      const x = width * 0.08 + (width * 0.74) * u;
      const damp = 1 - u * 0.18;
      const y = midY + Math.sin(u * Math.PI * peaks * 2) * amp * damp;
      pts.push([x, y]);
    } else {
      const u = (t - bodyEnd) / (1 - bodyEnd);
      const cx = width * 0.86;
      const cy = midY + amp * 0.35;
      const r = amp * 0.55;
      const ang = -Math.PI / 2 + u * Math.PI * 1.15;
      const x = cx + Math.cos(ang) * r;
      const y = cy + Math.sin(ang) * r;
      pts.push([x, y]);
    }
  }
  return pts;
}

function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

// Mini squiggle thumbnail with its own seed-like color shift
function MiniSquiggle({ peaks, hueShift = 0, label, sublabel, highlight = false }) {
  const W = 160, H = 110;
  const pts = useMemo(() => buildSquigglePath(W, H, 80, peaks, 0.86, 0.8), [peaks]);
  const pathD = useMemo(() => smoothPath(pts), [pts]);
  const stops = useMemo(() => {
    const base = [60, 35, 12, 350, 320];
    return base.map((hueBase, i) => ({
      offset: (i / (base.length - 1)) * 100,
      color: `hsl(${(hueBase + hueShift) % 360}, 95%, 55%)`,
    }));
  }, [hueShift]);
  const gradId = `grad-${peaks}-${hueShift}`.replace(".", "_");
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      padding: "14px",
      width: 168,
      boxShadow: highlight
        ? "0 0 0 2px #1a1a1a, 0 1px 0 rgba(0,0,0,0.04), 0 10px 30px -10px rgba(0,0,0,0.08)"
        : "0 1px 0 rgba(0,0,0,0.04), 0 10px 30px -10px rgba(0,0,0,0.08)",
      textAlign: "center",
    }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            {stops.map((s, i) => (
              <stop key={i} offset={`${s.offset}%`} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        color: "#9a9385",
        letterSpacing: "0.08em",
        marginTop: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        color: "#1a1a1a",
        marginTop: 1,
      }}>
        {sublabel}
      </div>
    </div>
  );
}

export default function LabPage() {
  // Animate the hue of the merged squiggle for delight
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 360), 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#efeae0",
        color: "#1a1a1a",
        fontFamily: "'Instrument Serif', Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.12em",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <a href="/" style={{ textDecoration: "none", color: "#1a1a1a", fontWeight: 600, letterSpacing: "0.3em", fontSize: 13 }}>
          BMAS
        </a>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <a href="/" style={navLink}>Home</a>
          <a href="/story" style={navLink}>Story</a>
          <a href="/lab" style={{ ...navLink, color: "#1a1a1a" }}>Lab</a>
        </div>
        <div style={{ width: 80 }} />
      </nav>

      {/* grain */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(0,0,0,0.025) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.02) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px 32px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={eyebrow}>Coming soon</p>
        <h1 style={pageTitle}>Merge Lab</h1>
        <p style={subhead}>
          Burn two squiggles, keep one.<br/>The curves combine. The supply goes down. Yours gets rarer.
        </p>
      </section>

      {/* Visual demo */}
      <section style={{
        maxWidth: 720,
        margin: "20px auto 0",
        padding: "32px 24px",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
        }}>
          <MiniSquiggle peaks={2.0} hueShift={10}  label="POINT" sublabel="#142" />
          <Operator>+</Operator>
          <MiniSquiggle peaks={3.5} hueShift={120} label="POINT" sublabel="#287" />
          <Operator>=</Operator>
          <MiniSquiggle peaks={4.6} hueShift={phase} label="MERGED" sublabel="rarer" highlight />
        </div>
      </section>

      {/* Mechanics */}
      <section style={{
        maxWidth: 640,
        margin: "60px auto 0",
        padding: "0 24px",
        position: "relative",
        zIndex: 1,
      }}>
        <h3 style={sectionLabel}>HOW MERGING WORKS</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}>
          <Card title="Burn"
            body="Two squiggle points you own get sent to a burn address. They&rsquo;re gone from the supply forever."
          />
          <Card title="Combine"
            body="A new squiggle is minted, with curves derived from both originals. More peaks, more color, more rarity."
          />
          <Card title="Hold"
            body="Your merged point is one of fewer total in circulation. Every merge makes the remaining squiggles rarer."
          />
        </div>
      </section>

      {/* Waitlist / note */}
      <section style={{
        maxWidth: 520,
        margin: "70px auto 0",
        padding: "0 24px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        <p style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: 19,
          lineHeight: 1.55,
          color: "#3a3a3a",
          margin: "0 0 22px",
        }}>
          The Lab opens once the squiggle has been acquired.<br/>
          Until then, every patron just holds a point.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "transparent",
            color: "#1a1a1a",
            textDecoration: "none",
            border: "1px solid #1a1a1a",
            borderRadius: 999,
            padding: "12px 26px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.25em",
            fontWeight: 600,
          }}
        >
          MINT A POINT
        </a>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 100,
          padding: "40px 24px 60px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 28,
          marginBottom: 18,
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 15,
        }}>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={footerLink}>X</a>
          <span style={{ color: "#cfc8b8" }}>·</span>
          <a href="https://opensea.io" target="_blank" rel="noopener noreferrer" style={footerLink}>OpenSea</a>
          <span style={{ color: "#cfc8b8" }}>·</span>
          <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" style={footerLink}>Etherscan</a>
        </div>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "#b0aa9c",
          margin: 0,
        }}>
          IMMUTABLE · NO ADMIN KEYS · VERIFIED ON ETHERSCAN
        </p>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "#c9c2b3",
          marginTop: 8,
        }}>
          0x0000...0000
        </p>
      </footer>
    </div>
  );
}

function Operator({ children }) {
  return (
    <div style={{
      fontFamily: "'Instrument Serif', Georgia, serif",
      fontSize: 36,
      color: "#9a9385",
      padding: "0 4px",
    }}>
      {children}
    </div>
  );
}

function Card({ title, body }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.5)",
      border: "1px solid rgba(0,0,0,0.05)",
      borderRadius: 10,
      padding: "20px",
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.25em",
        fontWeight: 600,
        marginBottom: 10,
      }}>
        {title.toUpperCase()}
      </div>
      <p style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: 15,
        lineHeight: 1.5,
        color: "#3a3a3a",
        margin: 0,
      }}>
        {body}
      </p>
    </div>
  );
}

const eyebrow = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  letterSpacing: "0.3em",
  color: "#9a9385",
  margin: "0 0 18px",
  textTransform: "uppercase",
};

const pageTitle = {
  fontFamily: "'Instrument Serif', Georgia, serif",
  fontWeight: 400,
  fontSize: 56,
  lineHeight: 1,
  margin: "0 0 18px",
  letterSpacing: "-0.01em",
};

const subhead = {
  fontFamily: "'Instrument Serif', Georgia, serif",
  fontSize: 19,
  lineHeight: 1.5,
  color: "#3a3a3a",
  margin: 0,
  fontStyle: "italic",
};

const sectionLabel = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  letterSpacing: "0.3em",
  fontWeight: 600,
  color: "#1a1a1a",
  textAlign: "center",
  margin: "0 0 28px",
};

const navLink = {
  color: "#1a1a1a",
  textDecoration: "none",
  fontSize: 13,
  letterSpacing: "0.04em",
  fontFamily: "'Instrument Serif', Georgia, serif",
  fontWeight: 500,
};

const footerLink = {
  color: "#1a1a1a",
  textDecoration: "none",
  letterSpacing: "0.02em",
};
