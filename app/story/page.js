"use client";

import React from "react";

export default function StoryPage() {
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
      {/* Top nav (simplified, same as home but Story active) */}
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
          <a href="/story" style={{ ...navLink, color: "#1a1a1a" }}>Story</a>
          <a href="#" style={{ ...navLink, color: "#999" }}>Lab</a>
        </div>
        <div style={{ width: 80 }} /> {/* spacer to keep nav centered */}
      </nav>

      {/* paper grain */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(0,0,0,0.025) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.02) 0%, transparent 60%)",
        }}
      />

      {/* ========= HEADER ========= */}
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={eyebrow}>Goal: Summer 2026</p>
        <h1 style={pageTitle}>The Plan</h1>
        <p style={subhead}>
          Here&rsquo;s how this is going to work &mdash; assuming you help.
          Nothing here has happened yet. That&rsquo;s the point.
        </p>
      </section>

      {/* ========= TIMELINE ========= */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "20px 24px 0", position: "relative", zIndex: 1 }}>
        <h3 style={sectionLabel}>TIMELINE</h3>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          {/* vertical line */}
          <div style={{
            position: "absolute",
            left: 7,
            top: 16,
            bottom: 16,
            width: 1,
            background: "rgba(0,0,0,0.12)",
          }} />
          <TimelineItem
            time="t = 0"
            milestone="MINT OPENS"
            body="The contract goes live on mainnet. First point costs the floor price. Anyone with a wallet can mint."
          />
          <TimelineItem
            time="+5 min"
            milestone="EARLY PATRONS"
            body="A handful of strangers see the post on X. First mints come in. Their squiggle points are the rarest by virtue of being first."
          />
          <TimelineItem
            time="hour 1"
            milestone="25% TO GOAL"
            body="Momentum builds. Each new mint pushes the price up slightly along the bonding curve. People share their points."
          />
          <TimelineItem
            time="hour 6"
            milestone="HALFWAY THERE"
            body="The progress bar crosses 1.4 ETH. The patron marquee fills with handles. The squiggle is closer than it was yesterday."
          />
          <TimelineItem
            time="hour 12"
            milestone="GOAL REACHED"
            body="2.8 ETH locked in the contract. Enough to acquire a Chromie Squiggle at floor. The contract flips to RESOLVED."
          />
          <TimelineItem
            time="hour 13"
            milestone="THE BUY"
            body="The contract&rsquo;s holder address purchases a Squiggle on the open market. The transaction is public, on-chain, screenshottable."
            isLast
          />
        </div>
      </section>

      {/* ========= THE PROMISE ========= */}
      <section style={{ maxWidth: 640, margin: "60px auto 0", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <h3 style={sectionLabel}>THE PROMISE</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}>
          <PromiseCard
            title="Immutable"
            body="The contract has no admin keys. Once it&rsquo;s deployed, no one &mdash; not even me &mdash; can change the rules or withdraw early."
          />
          <PromiseCard
            title="Refundable"
            body="If the goal isn&rsquo;t hit by the deadline, every patron can pull their full ETH back. The art stays in your wallet forever."
          />
          <PromiseCard
            title="Verifiable"
            body="Source code published. Contract verified on Etherscan. The squiggle purchase will be a public, traceable transaction."
          />
        </div>
      </section>

      {/* ========= BE THE FIRST ========= */}
      <section style={{ maxWidth: 560, margin: "80px auto 0", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h3 style={sectionLabel}>BE THE FIRST</h3>
        <p style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 19,
          lineHeight: 1.55,
          color: "#2a2a2a",
          margin: "0 0 24px",
        }}>
          The Community wall is empty right now. When the mint goes live,
          this is where every patron&rsquo;s handle will show up.
          The first names here will be the founding patrons.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "#1a1a1a",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 999,
            padding: "14px 28px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.25em",
            fontWeight: 600,
          }}
        >
          BACK TO MINT
        </a>
      </section>

      {/* ========= CLOSING LINE ========= */}
      <section style={{ maxWidth: 560, margin: "100px auto 0", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 26,
          lineHeight: 1.3,
          fontStyle: "italic",
          color: "#2a2a2a",
          margin: 0,
        }}>
          One squiggle. A few strangers.<br/>No marketing. Just a contract and a link.
        </p>
      </section>

      {/* ========= FOOTER ========= */}
      <footer
        style={{
          marginTop: 80,
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

function TimelineItem({ time, milestone, body, isLast }) {
  return (
    <div style={{
      position: "relative",
      paddingBottom: isLast ? 0 : 28,
    }}>
      {/* dot */}
      <div style={{
        position: "absolute",
        left: -24,
        top: 6,
        width: 15,
        height: 15,
        borderRadius: 999,
        background: "#efeae0",
        border: "2px solid #1a1a1a",
      }} />
      <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 4 }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: "#9a9385",
          letterSpacing: "0.05em",
          minWidth: 64,
        }}>
          {time}
        </span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.15em",
          color: "#1a1a1a",
        }}>
          {milestone}
        </span>
      </div>
      <p style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: 16,
        lineHeight: 1.5,
        color: "#3a3a3a",
        margin: "0 0 0 76px",
      }}>
        {body}
      </p>
    </div>
  );
}

function PromiseCard({ title, body }) {
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
  fontSize: 20,
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
  margin: "0 0 32px",
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
