"use client";

import React, { useState, useEffect, useMemo } from "react";

// buymeasquiggle.xyz
// Inspired by buymeapunk.xyz aesthetic — cream paper, editorial serif headline,
// mono numerals, restrained controls. Twist: animated Chromie Squiggle hero,
// "points" along the squiggle as the unit, accent color cycles through the
// squiggle's gradient.

const GOAL_ETH = 2.8;
const RAISED_ETH = 1.6234; // demo state
const PATRONS = 142;
const POINTS_TOTAL = 720; // 720 points along the squiggle
const PRICE_PER_POINT = +(GOAL_ETH / POINTS_TOTAL).toFixed(7); // ~0.0038889

// Countdown target: ~4d 12h from "now" — recomputed each render against Date.now
function useCountdown(targetMs) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, done: diff === 0 };
}

// Generate the squiggle path. A Chromie Squiggle is a sine wave with phase
// and amplitude variation, rendered as connected segments with a hue ramp.
function useSquigglePath(width, height, segments = 60) {
  return useMemo(() => {
    const pts = [];
    const midY = height / 2;
    const amp = height * 0.28;
    // Chromie Squiggle: tight wave that compresses, dampens, and finishes with a hook
    const PEAKS = 3.2;
    const bodyEnd = 0.86;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      if (t <= bodyEnd) {
        const u = t / bodyEnd;
        const x = width * 0.08 + (width * 0.74) * u;
        const damp = 1 - u * 0.18;
        const y = midY + Math.sin(u * Math.PI * PEAKS * 2) * amp * damp;
        pts.push([x, y]);
      } else {
        // The signature hook: small curl at the end like in the reference
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
  }, [width, height, segments]);
}

// Smooth SVG path from points using Catmull-Rom -> cubic Bezier
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

function Squiggle({ phase = 0 }) {
  const W = 240, H = 120;
  const pts = useSquigglePath(W, H, 140);
  const pathD = useMemo(() => smoothPath(pts), [pts]);

  const stops = useMemo(() => {
    // yellow → orange → red → pink → magenta — same ramp as the reference
    const base = [60, 35, 12, 350, 320];
    return base.map((hueBase, i) => ({
      offset: (i / (base.length - 1)) * 100,
      color: `hsl(${(hueBase + phase) % 360}, 95%, 55%)`,
    }));
  }, [phase]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="squiggle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          {stops.map((s, i) => (
            <stop key={i} offset={`${s.offset}%`} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="url(#squiggle-grad)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function fmt(n, p = 4) {
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: p,
    maximumFractionDigits: p,
  });
}

// --- Top navigation bar ---
function TopNav() {
  return (
    <nav
      style={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 40px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        letterSpacing: "0.12em",
      }}
    >
      <div style={{ fontWeight: 600, letterSpacing: "0.3em", fontSize: 13 }}>
        BMAS
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        <a href="#" style={navLink}>Home</a>
        <a href="#" style={{ ...navLink, color: "#999" }}>Story</a>
        <a href="#" style={{ ...navLink, color: "#999" }}>Lab</a>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* X icon */}
        <a href="#" style={iconLink} aria-label="X">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        {/* OpenSea-ish circle icon */}
        <a href="#" style={iconLink} aria-label="OpenSea">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#2081E2" />
            <path d="M5 13.5c0-.5.4-.9.9-.9h2.6V11l1.6-2.3a.2.2 0 01.4.1V13h3.7s-.7 2.3-3.5 2.3H6.4c-.6 0-1.1-.4-1.1-1V13.5z" fill="#fff" />
          </svg>
        </a>
        <button
          style={{
            border: "1px solid #1a1a1a",
            background: "transparent",
            borderRadius: 999,
            padding: "8px 18px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            fontWeight: 500,
            cursor: "pointer",
            color: "#1a1a1a",
          }}
        >
          CONNECT
        </button>
      </div>
    </nav>
  );
}

const navLink = {
  color: "#1a1a1a",
  textDecoration: "none",
  fontSize: 13,
  letterSpacing: "0.04em",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontWeight: 500,
};

const iconLink = {
  color: "#1a1a1a",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: 999,
  textDecoration: "none",
};

// --- Patron marquee (scrolling handles + pinned badge) ---
const PATRON_HANDLES = [
  "@wg","@jay_chans","@rostisi","@maomao782f","@Luaanalo","@SkyAAmen",
  "@jaychans8cc","@mdouysy","@mak1111222","@kersa1n","@ThangP97","@KozalakB",
  "@TheMissSey","@Chamom1le","@0xhuowa","@fnd_alpx","@nsSHABii","@MUSODES",
  "@haxx_sol","@a9touyan5211314","@BundlesofFun_","@KGKG1019","@Jagadee2504K",
  "@florent","@snowfro","@chromie","@artblocks","@0xether","@punks6529",
];

function PatronMarquee({ direction = "left" }) {
  const trackClass = direction === "left" ? "marquee-track-left" : "marquee-track-right";
  // Duplicate the content so the loop is seamless
  const content = (
    <div className={`marquee-row ${trackClass}`}>
      {[...PATRON_HANDLES, ...PATRON_HANDLES].map((h, i) => {
        // Insert the badge roughly in the middle of each pass
        if (i === 4 || i === PATRON_HANDLES.length + 4) {
          return (
            <React.Fragment key={`badge-${i}`}>
              <span style={handleStyle}>{h}</span>
              <span style={badgeStyle}>
                <span style={{
                  width: 18, height: 18, borderRadius: 999,
                  background: "linear-gradient(135deg,#f5d442,#f54242,#e84298)",
                  display: "inline-block",
                  marginRight: 2,
                }} />
                142 patrons minted points to fund a Chromie Squiggle
                <span style={{
                  width: 18, height: 18, borderRadius: 999,
                  background: "linear-gradient(135deg,#42c5f5,#9b42f5,#f542d4)",
                  display: "inline-block",
                  marginLeft: 2,
                }} />
              </span>
            </React.Fragment>
          );
        }
        return <span key={i} style={handleStyle}>{h}</span>;
      })}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(0,0,0,0.015)",
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      {content}
    </div>
  );
}

const handleStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  color: "#9a9385",
  letterSpacing: "0.02em",
  fontWeight: 400,
};

const badgeStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  color: "#1a1a1a",
  fontWeight: 600,
  letterSpacing: "0.01em",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "4px 12px",
};

export default function BuyMeASquiggle() {
  // target ~ 4d 12h 34m from now, stable per session
  const target = useMemo(() => Date.now() + (4 * 86400 + 12 * 3600 + 34 * 60) * 1000, []);
  const { d, h, m, s } = useCountdown(target);

  const [points, setPoints] = useState(1);
  const [phase, setPhase] = useState(0);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1.2) % 360), 60);
    return () => clearInterval(id);
  }, []);

  const totalCost = +(points * PRICE_PER_POINT).toFixed(7);
  const progressPct = Math.min(100, (RAISED_ETH / GOAL_ETH) * 100);

  const handleMint = () => {
    if (minting || minted) return;
    setMinting(true);
    setTimeout(() => {
      setMinting(false);
      setMinted(true);
      setTimeout(() => setMinted(false), 2400);
    }, 1400);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#efeae0",
        color: "#1a1a1a",
        fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .marquee-row {
          display: flex;
          width: max-content;
          gap: 28px;
          padding: 8px 0;
          align-items: center;
          white-space: nowrap;
        }
        .marquee-track-left  { animation: marquee-left  90s linear infinite; }
        .marquee-track-right { animation: marquee-right 90s linear infinite; }
      `}</style>

      {/* Marquees */}
      <PatronMarquee direction="left"  />
      <PatronMarquee direction="right" />

      {/* Top nav */}
      <TopNav />

      {/* paper grain */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(0,0,0,0.025) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.02) 0%, transparent 60%)",
        }}
      />

      <div style={{
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        padding: "40px 20px 80px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 500,
            fontSize: "44px",
            lineHeight: 1.05,
            textAlign: "center",
            margin: "12px 0 36px",
            letterSpacing: "-0.01em",
          }}
        >
          buy me a squiggle<br/>
          <span style={{ fontStyle: "italic" }}>or get a refund</span>
        </h1>

        {/* Hero card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "22px 16px",
            margin: "0 auto 28px",
            width: 180,
            height: 130,
            display: "flex",
            alignItems: "center",
            boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 10px 30px -10px rgba(0,0,0,0.08)",
          }}
        >
          <Squiggle phase={phase} />
        </div>

        {/* Live + countdown */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <span
            style={{
              background: "#1a1a1a",
              color: "#fff",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: 999,
              letterSpacing: "0.05em",
              marginRight: 10,
            }}
          >
            ● LIVE
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              color: "#1a1a1a",
              letterSpacing: "0.04em",
            }}
          >
            {String(d).padStart(2, "0")}<sub style={subSx}>d</sub>{" "}
            {String(h).padStart(2, "0")}<sub style={subSx}>h</sub>{" "}
            {String(m).padStart(2, "0")}<sub style={subSx}>m</sub>{" "}
            {String(s).padStart(2, "0")}<sub style={subSx}>s</sub>
          </span>
        </div>

        {/* Price */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 38,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {fmt(PRICE_PER_POINT, 7)} ETH
          </span>
        </div>
        <div
          style={{
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "#888",
            letterSpacing: "0.18em",
            marginBottom: 22,
          }}
        >
          PER POINT
        </div>

        {/* Raised + patrons */}
        <div
          style={{
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          <strong style={{ fontWeight: 600 }}>{fmt(RAISED_ETH, 4)}</strong>
          <span style={{ color: "#888" }}> ETH raised</span>
          <span style={{ color: "#bbb", margin: "0 10px" }}>·</span>
          <strong style={{ fontWeight: 600 }}>{PATRONS}</strong>
          <span style={{ color: "#888" }}> patrons</span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            background: "#d8d3c7",
            borderRadius: 999,
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: `${progressPct}%`,
              height: "100%",
              background: "#1a1a1a",
              transition: "width 600ms ease",
            }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#999",
            marginBottom: 22,
            letterSpacing: "0.05em",
          }}
        >
          {fmt(RAISED_ETH, 2)} / {GOAL_ETH.toFixed(2)} ETH
        </div>

        {/* Input + steppers */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 10,
            padding: "4px",
            boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
            marginBottom: 10,
          }}
        >
          <button
            onClick={() => setPoints((p) => Math.max(1, p - 1))}
            style={stepBtn}
            aria-label="decrease"
          >−</button>
          <input
            type="text"
            value={fmt(totalCost, 7)}
            readOnly
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              textAlign: "center",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              color: "#1a1a1a",
              background: "transparent",
              padding: "14px 0",
            }}
          />
          <button
            onClick={() => setPoints((p) => Math.min(POINTS_TOTAL, p + 1))}
            style={stepBtn}
            aria-label="increase"
          >+</button>
        </div>

        <div
          style={{
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#999",
            marginBottom: 18,
          }}
        >
          {points} point{points !== 1 ? "s" : ""} = {fmt(totalCost, 7)} ETH
        </div>

        {/* Mint */}
        <button
          onClick={handleMint}
          disabled={minting}
          style={{
            width: "100%",
            background: minted ? "#2d5a3d" : "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "20px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.28em",
            cursor: minting ? "wait" : "pointer",
            transition: "background 200ms, transform 100ms",
            transform: minting ? "scale(0.99)" : "scale(1)",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {minting ? "MINTING…" : minted ? "✓ MINTED" : "MINT"}
        </button>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 17,
            fontStyle: "italic",
            color: "#5a5a5a",
            lineHeight: 1.5,
          }}
        >
          full refund if it fails<br/>
          you keep the art
        </p>

        {/* tiny attribution / domain */}
        <p
          style={{
            textAlign: "center",
            marginTop: 32,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "#b0aa9c",
            letterSpacing: "0.2em",
          }}
        >
          BUYMEASQUIGGLE.XYZ
        </p>
      </div>
    </div>
  );
}

const subSx = {
  fontSize: 9,
  color: "#999",
  marginLeft: 1,
  fontWeight: 400,
};

const stepBtn = {
  width: 44,
  height: 44,
  border: "none",
  background: "transparent",
  fontSize: 22,
  color: "#666",
  cursor: "pointer",
  fontFamily: "'JetBrains Mono', monospace",
  borderRadius: 8,
};
