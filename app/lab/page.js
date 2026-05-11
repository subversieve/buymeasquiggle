"use client";

import React, { useState, useEffect } from "react";
import { BMASSquiggle, YS_ORGANIC } from "../lib/squiggle";
import { BMAS_ADDRESS } from "../lib/contract";

// Lab page — shows the merge mechanic with real on-chain squiggle art.
// The same seed (YS_ORGANIC) is used for all three thumbnails, with
// increasing point counts, accurately reflecting how merge works:
// the survivor keeps its seed and gains the burned token's points.

function SquiggleThumbnail({ points, startHue, bgGray, label, sublabel, highlight, phaseShift = 0 }) {
  return (
    <div style={{
      borderRadius: 14,
      overflow: "hidden",
      width: 180,
      boxShadow: highlight
        ? "0 0 0 2px #1a1a1a, 0 4px 24px -4px rgba(0,0,0,0.18)"
        : "0 1px 0 rgba(0,0,0,0.06), 0 8px 24px -8px rgba(0,0,0,0.12)",
      textAlign: "center",
    }}>
      <BMASSquiggle
        points={points}
        ys={YS_ORGANIC}
        startHue={startHue}
        bgGray={bgGray}
        phaseShift={phaseShift}
        width="100%"
        height="auto"
      />
      <div style={{
        background: "#fff",
        padding: "10px 12px 12px",
      }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9a9385", letterSpacing: "0.08em" }}>
          {label}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#1a1a1a", marginTop: 2, fontWeight: 600 }}>
          {sublabel}
        </div>
      </div>
    </div>
  );
}

export default function LabPage() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 360), 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#efeae0", color: "#1a1a1a", fontFamily: "'Instrument Serif', Georgia, serif", position: "relative", overflow: "hidden" }}>

      <nav style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.12em", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <a href="/" style={{ textDecoration: "none", color: "#1a1a1a", fontWeight: 600, letterSpacing: "0.3em", fontSize: 13 }}>BMAS</a>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <a href="/" style={navLink}>Home</a>
          <a href="/story" style={navLink}>Story</a>
          <a href="/lab" style={{ ...navLink, color: "#1a1a1a" }}>Lab</a>
        </div>
        <div style={{ width: 80 }} />
      </nav>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 30% 20%, rgba(0,0,0,0.025) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.02) 0%, transparent 60%)" }} />

      {/* Header */}
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px 32px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={eyebrow}>Coming soon</p>
        <h1 style={pageTitle}>Merge Lab</h1>
        <p style={subhead}>
          Burn two pieces, keep one.<br/>
          Your survivor gains more slices. The supply goes down.
        </p>
      </section>

      {/* Visual demo */}
      <section style={{ maxWidth: 720, margin: "20px auto 0", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <SquiggleThumbnail
            points={3}
            startHue={20}
            bgGray={30}
            label="YOURS"
            sublabel="3 PTS"
          />
          <Operator>+</Operator>
          <SquiggleThumbnail
            points={6}
            startHue={20}
            bgGray={30}
            label="BURNED"
            sublabel="6 PTS"
          />
          <Operator>=</Operator>
          <SquiggleThumbnail
            points={9}
            startHue={20}
            bgGray={30}
            label="MERGED"
            sublabel="9 PTS · RARER"
            highlight
            phaseShift={phase}
          />
        </div>
        <p style={{ textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9a9385", letterSpacing: "0.15em", marginTop: 20 }}>
          SAME SEED · MORE SLICES · ONE FEWER TOKEN IN EXISTENCE
        </p>
      </section>

      {/* Mechanics */}
      <section style={{ maxWidth: 640, margin: "60px auto 0", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <h3 style={sectionLabel}>HOW MERGING WORKS</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <Card title="Burn"
            body="You pick one of your tokens to burn. It's gone from the chain permanently — its slices transfer to your survivor."
          />
          <Card title="Grow"
            body="Your surviving token gains the burned token's slices. More slices means a richer, fuller token."
          />
          <Card title="Deflate"
            body="Total NFT supply drops by one. Every merge makes remaining BMAS rarer. The art is yours either way."
          />
        </div>
      </section>

      {/* Full squiggle preview */}
      <section style={{ maxWidth: 480, margin: "70px auto 0", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={sectionLabel}>15 PT FULL SQUIGGLE</p>
        <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 32px -8px rgba(0,0,0,0.2)" }}>
          <BMASSquiggle points={15} ys={YS_ORGANIC} startHue={20} bgGray={30} phaseShift={phase} width="100%" height="auto" />
        </div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9a9385", letterSpacing: "0.15em", marginTop: 14 }}>
          MAX POINTS · ALL 15 SLICES RENDERED
        </p>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 520, margin: "70px auto 0", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: 19, lineHeight: 1.55, color: "#3a3a3a", margin: "0 0 22px" }}>
          The Lab opens once the squiggle has been acquired.<br/>
          Until then, every patron just holds a point.
        </p>
        <a href="/" style={{ display: "inline-block", background: "transparent", color: "#1a1a1a", textDecoration: "none", border: "1px solid #1a1a1a", borderRadius: 999, padding: "12px 26px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.25em", fontWeight: 600 }}>
          MINT A POINT
        </a>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 100, padding: "40px 24px 60px", textAlign: "center", position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 18, fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 15 }}>
          <a href="https://x.com/subversieve" target="_blank" rel="noopener noreferrer" style={footerLink}>X</a>
          <span style={{ color: "#cfc8b8" }}>·</span>
          <a href={`https://opensea.io/assets/ethereum/${BMAS_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={footerLink}>OpenSea</a>
          <span style={{ color: "#cfc8b8" }}>·</span>
          <a href={`https://etherscan.io/address/${BMAS_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={footerLink}>Etherscan</a>
        </div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: "#b0aa9c", margin: 0 }}>
          IMMUTABLE · CODE IS LAW · VERIFIED ON ETHERSCAN
        </p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#c9c2b3", marginTop: 8 }}>
          {BMAS_ADDRESS.toLowerCase()}
        </p>
      </footer>
    </div>
  );
}

function Operator({ children }) {
  return (
    <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, color: "#9a9385", padding: "0 4px" }}>
      {children}
    </div>
  );
}

function Card({ title, body }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 10, padding: "20px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.25em", fontWeight: 600, marginBottom: 10 }}>
        {title.toUpperCase()}
      </div>
      <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 15, lineHeight: 1.5, color: "#3a3a3a", margin: 0 }}>
        {body}
      </p>
    </div>
  );
}

const eyebrow = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.3em", color: "#9a9385", margin: "0 0 18px", textTransform: "uppercase" };
const pageTitle = { fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontSize: 56, lineHeight: 1, margin: "0 0 18px", letterSpacing: "-0.01em" };
const subhead = { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 19, lineHeight: 1.5, color: "#3a3a3a", margin: 0, fontStyle: "italic" };
const sectionLabel = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.3em", fontWeight: 600, color: "#1a1a1a", textAlign: "center", margin: "0 0 28px" };
const navLink = { color: "#1a1a1a", textDecoration: "none", fontSize: 13, letterSpacing: "0.04em", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 500 };
const footerLink = { color: "#1a1a1a", textDecoration: "none", letterSpacing: "0.02em" };
