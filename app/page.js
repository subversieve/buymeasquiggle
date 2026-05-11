"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import {
  BMAS_ADDRESS, CHAIN_ID, GOAL_ETH, MAX_POINTS_PER_MINT,
  getReadContract, getWriteContract,
} from "./lib/contract";
import { BMASSquiggle, YS_ORGANIC } from "./lib/squiggle";

// buymeasquiggle.xyz

function useCountdown(targetSec) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetSec - now);
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return { d, h, m, s, done: diff === 0 };
}

function useSquigglePath(width, height, segments = 60) {
  return useMemo(() => {
    const pts = [];
    const midY = height / 2;
    const amp = height * 0.28;
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
    const base = [60, 35, 12, 350, 320];
    return base.map((hueBase, i) => ({
      offset: (i / (base.length - 1)) * 100,
      color: `hsl(${(hueBase + phase) % 360}, 95%, 55%)`,
    }));
  }, [phase]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
      <defs>
        <linearGradient id="squiggle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          {stops.map((s, i) => <stop key={i} offset={`${s.offset}%`} stopColor={s.color} />)}
        </linearGradient>
      </defs>
      <path d={pathD} fill="none" stroke="url(#squiggle-grad)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function fmt(n, p = 4) {
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: p, maximumFractionDigits: p });
}

function TopNav({ walletAddress, onConnect }) {
  const shortAddr = walletAddress
    ? walletAddress.slice(0, 6) + "…" + walletAddress.slice(-4)
    : null;
  return (
    <nav style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 40px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, letterSpacing: "0.12em" }}>
      <a href="/" style={{ textDecoration: "none", color: "#1a1a1a", fontWeight: 600, letterSpacing: "0.3em", fontSize: 16, flex: 1 }}>BMAS</a>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        <a href="/" style={navLink}>Home</a>
        <a href="/story" style={navLink}>Story</a>
        <a href="/lab" style={navLink}>Lab</a>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
        <a href="https://x.com/subversieve" target="_blank" rel="noopener noreferrer" style={iconLink} aria-label="X">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a href={`https://opensea.io/assets/ethereum/${BMAS_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={iconLink} aria-label="OpenSea">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.091-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H8.053a4.019 4.019 0 0 1-4.019-4.02v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.126.661.207.4.62.648 1.066.648h1.671v-1.289H8.937a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.86.024-.055.045-.111.065-.166.033-.094.067-.182.091-.269a4.57 4.57 0 0 0 .065-.223c.057-.25.081-.514.081-.787 0-.108-.004-.221-.014-.327-.005-.117-.019-.234-.033-.35a3.2 3.2 0 0 0-.052-.312 6.494 6.494 0 0 0-.15-.641l-.021-.075c-.043-.143-.08-.301-.122-.444a12.16 12.16 0 0 0-.4-1.098 6.59 6.59 0 0 0-.24-.499 9.894 9.894 0 0 0-.095-.182 8.39 8.39 0 0 0-.217-.373c-.03-.051-.063-.1-.094-.151l-.027-.043a.106.106 0 0 1 .107-.16l2.537.68a.1.1 0 0 1 .073.076c.031.134.065.266.103.394.037.13.078.257.12.38.043.124.086.246.132.364.046.12.094.237.143.352.096.228.202.45.313.658.034.062.067.123.103.181.036.059.074.115.112.167.038.053.078.102.118.149.04.047.083.089.126.129.045.042.091.079.138.114.047.036.094.068.145.096.05.028.103.052.157.07.053.019.108.032.163.036.055.004.11.001.163-.009.053-.01.103-.028.152-.055.049-.028.094-.065.134-.108.042-.044.077-.095.107-.151a1.01 1.01 0 0 0 .068-.196c.016-.073.024-.149.024-.225a.906.906 0 0 0-.024-.2 1.088 1.088 0 0 0-.063-.189 1.525 1.525 0 0 0-.093-.181 2.436 2.436 0 0 0-.116-.17 2.826 2.826 0 0 0-.128-.155l-.063-.068a.106.106 0 0 1 .071-.178l2.054.551a.11.11 0 0 1 .08.104c0 .05.002.1.002.15 0 .437-.065.86-.186 1.261a5.405 5.405 0 0 1-.532 1.178 5.445 5.445 0 0 1-.827 1.013 4.956 4.956 0 0 1-1.098.754 4.756 4.756 0 0 1-1.344.406 4.93 4.93 0 0 1-.753.056 4.848 4.848 0 0 1-.766-.063 4.75 4.75 0 0 1-.74-.189 4.685 4.685 0 0 1-.698-.313v1.289h1.601c.313 0 .612-.111.848-.312.078-.067.425-.37.819-.802a.11.11 0 0 1 .086-.038h3.498c.063 0 .109.06.092.12z"/>
          </svg>
        </a>
        <button onClick={onConnect} style={{ border: "1px solid #1a1a1a", background: "transparent", borderRadius: 999, padding: "10px 22px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, letterSpacing: "0.2em", fontWeight: 500, cursor: "pointer", color: "#1a1a1a" }}>
          {shortAddr || "CONNECT"}
        </button>
      </div>
    </nav>
  );
}

const iconLink = { color: "#9a9385", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 999, textDecoration: "none" };

const PLACEHOLDER_ITEMS = [
  "mint a slice", "be the first patron", "your name here",
  "mint a slice", "join the crowdfund", "your name here",
  "mint a slice", "be the first patron", "your name here",
  "mint a slice", "join the crowdfund", "your name here",
];

function PatronMarquee({ direction = "left" }) {
  const trackClass = direction === "left" ? "marquee-track-left" : "marquee-track-right";
  const content = (
    <div className={`marquee-row ${trackClass}`}>
      {[...PLACEHOLDER_ITEMS, ...PLACEHOLDER_ITEMS].map((item, i) => (
        <span key={i} style={handleStyle}>{item}</span>
      ))}
    </div>
  );
  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(0,0,0,0.06)", background: "rgba(0,0,0,0.015)", maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}>
      {content}
    </div>
  );
}

const handleStyle = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#9a9385", letterSpacing: "0.02em", fontWeight: 400 };
const badgeStyle = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#1a1a1a", fontWeight: 600, letterSpacing: "0.01em", display: "inline-flex", alignItems: "center", gap: 10, padding: "4px 12px" };

export default function BuyMeASquiggle() {
  const [points, setPoints] = useState(1);
  const [phase, setPhase] = useState(0);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  // Wallet state
  const [walletAddress, setWalletAddress] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  // Live contract state
  const [contractData, setContractData] = useState(null);
  const [cost, setCost] = useState(null);

  // Animate squiggle hue
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1.2) % 360), 60);
    return () => clearInterval(id);
  }, []);

  // Read contract state
  const fetchContractData = useCallback(async () => {
    try {
      const contract = getReadContract();
      const [totalRaised, totalPointsSold, nextTokenId, deadline, pointPrice] = await Promise.all([
        contract.totalRaised(),
        contract.totalPointsSold(),
        contract.nextTokenId(),
        contract.deadline(),
        contract.currentPointPrice(),
      ]);
      setContractData({
        totalRaisedEth: parseFloat(ethers.formatEther(totalRaised)),
        pointsSold: Number(totalPointsSold),
        patronCount: Number(nextTokenId) - 1,
        deadlineSec: Number(deadline),
        pointPriceEth: parseFloat(ethers.formatEther(pointPrice)),
      });
    } catch (e) {
      console.error("Failed to fetch contract state:", e);
    }
  }, []);

  useEffect(() => { fetchContractData(); }, [fetchContractData]);

  // Fetch cost for selected points
  useEffect(() => {
    let cancelled = false;
    async function fetchCost() {
      try {
        const contract = getReadContract();
        const raw = await contract.costForPoints(points);
        if (!cancelled) setCost(ethers.formatEther(raw));
      } catch {
        if (!cancelled) setCost(null);
      }
    }
    fetchCost();
    return () => { cancelled = true; };
  }, [points]);

  // Countdown from contract deadline
  const deadlineSec = contractData?.deadlineSec ?? Math.floor(Date.now() / 1000) + 30 * 86400;
  const { d, h, m, s } = useCountdown(deadlineSec);

  // Wallet connection
  const handleConnect = useCallback(async () => {
    if (!window.ethereum) { setError("MetaMask not found. Please install it."); return; }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      setWrongNetwork(parseInt(chainIdHex, 16) !== CHAIN_ID);
    } catch (e) {
      setError("Connection cancelled.");
    }
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = (accounts) => setWalletAddress(accounts[0] || null);
    const onChain = (chainIdHex) => setWrongNetwork(parseInt(chainIdHex, 16) !== CHAIN_ID);
    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccounts);
      window.ethereum.removeListener("chainChanged", onChain);
    };
  }, []);

  // Mint
  const handleMint = useCallback(async () => {
    setError(null);
    if (!walletAddress) { await handleConnect(); return; }
    if (wrongNetwork) { setError("Switch to Ethereum Mainnet in MetaMask."); return; }
    if (minting || minted) return;

    setMinting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getWriteContract(signer);

      const rawCost = await contract.costForPoints(points);
      const tx = await contract.mint({ value: rawCost });
      setTxHash(tx.hash);
      await tx.wait();
      setMinted(true);
      fetchContractData();
      setTimeout(() => setMinted(false), 4000);
    } catch (e) {
      const msg = e?.reason || e?.shortMessage || e?.message || "Transaction failed.";
      setError(msg.length > 120 ? msg.slice(0, 120) + "…" : msg);
    } finally {
      setMinting(false);
    }
  }, [walletAddress, wrongNetwork, minting, minted, points, handleConnect, fetchContractData]);

  const raisedEth = contractData?.totalRaisedEth ?? 0;
  const patronCount = contractData?.patronCount ?? 0;
  const progressPct = Math.min(100, (raisedEth / GOAL_ETH) * 100);

  const mintLabel = minting ? "MINTING…" : minted ? "✓ MINTED" : !walletAddress ? "CONNECT & MINT" : wrongNetwork ? "WRONG NETWORK" : "MINT";

  return (
    <div style={{ minHeight: "100vh", background: "#efeae0", color: "#1a1a1a", fontFamily: "'Instrument Serif', Georgia, serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
        .marquee-row { display: flex; width: max-content; gap: 28px; padding: 8px 0; align-items: center; white-space: nowrap; }
        .marquee-track-left  { animation: marquee-left  90s linear infinite; }
        .marquee-track-right { animation: marquee-right 90s linear infinite; }
      `}</style>

      <PatronMarquee direction="left"  patronCount={patronCount || null} />
      <PatronMarquee direction="right" patronCount={patronCount || null} />
      <TopNav walletAddress={walletAddress} onConnect={handleConnect} />

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 30% 20%, rgba(0,0,0,0.025) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.02) 0%, transparent 60%)" }} />

      <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", padding: "40px 20px 80px", position: "relative", zIndex: 1 }}>

        <p style={{ textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.3em", color: "#9a9385", margin: "0 0 22px", textTransform: "uppercase" }}>
          An on-chain experiment
        </p>

        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 500, fontSize: "50px", lineHeight: 1.05, textAlign: "center", margin: "0 0 36px", letterSpacing: "-0.01em" }}>
          buy me a squiggle
        </h1>

        <div style={{ borderRadius: 14, margin: "0 auto 28px", width: 280, overflow: "hidden", boxShadow: "0 1px 0 rgba(0,0,0,0.08), 0 10px 40px -10px rgba(0,0,0,0.18)" }}>
          <BMASSquiggle points={15} ys={YS_ORGANIC} startHue={0} bgGray={20} phaseShift={phase} width="100%" height="auto" />
        </div>

        {/* Live + countdown */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <span style={{ background: "#1a1a1a", color: "#fff", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999, letterSpacing: "0.05em", marginRight: 10 }}>● LIVE</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: "#1a1a1a", letterSpacing: "0.04em" }}>
            {String(d).padStart(2, "0")}<sub style={subSx}>d</sub>{" "}
            {String(h).padStart(2, "0")}<sub style={subSx}>h</sub>{" "}
            {String(m).padStart(2, "0")}<sub style={subSx}>m</sub>{" "}
            {String(s).padStart(2, "0")}<sub style={subSx}>s</sub>
          </span>
        </div>

        {/* Price */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 42, fontWeight: 500, letterSpacing: "-0.01em" }}>
            {contractData ? fmt(contractData.pointPriceEth, 6) : "———"} ETH
          </span>
        </div>
        <div style={{ textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#888", letterSpacing: "0.18em", marginBottom: 22 }}>
          PER SLICE
        </div>

        {/* Raised + patrons */}
        <div style={{ textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, marginBottom: 14 }}>
          <strong style={{ fontWeight: 600 }}>{fmt(raisedEth, 4)}</strong>
          <span style={{ color: "#888" }}> ETH raised</span>
          <span style={{ color: "#bbb", margin: "0 10px" }}>·</span>
          <strong style={{ fontWeight: 600 }}>{patronCount}</strong>
          <span style={{ color: "#888" }}> patrons</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "#d8d3c7", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: "#1a1a1a", transition: "width 600ms ease" }} />
        </div>
        <div style={{ textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#999", marginBottom: 22, letterSpacing: "0.05em" }}>
          {fmt(raisedEth, 4)} / {GOAL_ETH.toFixed(3)} ETH
        </div>

        {/* Input + steppers */}
        <div style={{ textAlign: "center", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: 16, color: "#9a9385", marginBottom: 10 }}>
          How many slices do you want?
        </div>
        <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 10, padding: "4px", boxShadow: "0 1px 0 rgba(0,0,0,0.04)", marginBottom: 10 }}>
          <button onClick={() => setPoints((p) => Math.max(1, p - 1))} style={stepBtn} aria-label="decrease">−</button>
          <input
            type="text"
            value={points}
            readOnly
            style={{ flex: 1, border: "none", outline: "none", textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 36, color: "#1a1a1a", background: "transparent", padding: "14px 0" }}
          />
          <button onClick={() => setPoints((p) => Math.min(MAX_POINTS_PER_MINT, p + 1))} style={stepBtn} aria-label="increase">+</button>
        </div>

        <div style={{ textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#999", marginBottom: 18 }}>
          {points} slice{points !== 1 ? "s" : ""} = {cost != null ? fmt(parseFloat(cost), 6) : "———"} ETH
        </div>

        {/* Mint button */}
        <button
          onClick={handleMint}
          disabled={minting}
          style={{ width: "100%", background: minted ? "#2d5a3d" : wrongNetwork ? "#8b2e2e" : "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, padding: "20px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600, letterSpacing: "0.28em", cursor: minting ? "wait" : "pointer", transition: "background 200ms, transform 100ms", transform: minting ? "scale(0.99)" : "scale(1)" }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {mintLabel}
        </button>

        {/* Error */}
        {error && (
          <p style={{ textAlign: "center", marginTop: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#8b2e2e", letterSpacing: "0.05em" }}>
            {error}
          </p>
        )}

        {/* Tx link */}
        {txHash && (
          <p style={{ textAlign: "center", marginTop: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#888" }}>
            <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: "#1a1a1a" }}>
              view transaction ↗
            </a>
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: 28, fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, fontStyle: "italic", color: "#5a5a5a", lineHeight: 1.5 }}>
          full refund if it fails<br/>
          you keep the art
        </p>
      </div>

      {/* STORY SECTION */}
      <section style={{ maxWidth: 520, margin: "60px auto 0", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <h2 style={sectionHeading}>What is Buy Me A Squiggle?</h2>
        <p style={storyParagraph}>One person asking the internet to help them buy a Chromie Squiggle. No promises, no roadmap, no team &mdash; just a contract, a deadline, and a commitment.</p>
        <p style={storyParagraph}>Chromie Squiggles are Erick &ldquo;Snowfro&rdquo; Calderon&rsquo;s seminal generative art collection on Art Blocks &mdash; the project that, in many ways, launched on-chain generative art as a movement. Owning one has always felt out of reach for most. This is one attempt to change that, for one person, with help from strangers.</p>
        <p style={storyParagraph}>Every patron receives a unique on-chain BMAS NFT. The more ETH you contribute, the more slices appear — from a single curve up to the full 15. Each point costs slightly more than the last &mdash; a bonding curve baked into the contract. Earlier patrons pay less. If the goal is reached, minting closes and the creator withdraws to a public wallet to buy the Squiggle — the transaction is the proof. If the goal isn't reached by the deadline, every patron can claim a full refund. The contract is immutable. No one can change the rules. The code is law &mdash; and trust is earned with every transaction.</p>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 720, margin: "60px auto 0", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <h2 style={{ ...sectionHeading, marginBottom: 28 }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <HowItem label="Mint" body="Patrons send ETH and receive a unique on-chain BMAS NFT. Each token has an immutable seed that determines its output — more slices reveals more of it." />
          <HowItem label="Fund" body="ETH is held in the contract until the goal is met. If the goal is reached, the creator withdraws to a public wallet and commits to buying a Chromie Squiggle. Every step is visible on-chain." />
          <HowItem label="Resolve" body="If a Squiggle is bought, the on-chain transaction proves it. If the goal isn't met by the deadline, every patron can pull a full refund. The art stays in your wallet either way." />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: 80, padding: "40px 24px 60px", textAlign: "center", position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 18, fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 15 }}>
          <a href="https://x.com/subversieve" target="_blank" rel="noopener noreferrer" style={footerLink}>X</a>
          <span style={{ color: "#cfc8b8" }}>·</span>
          <a href={`https://opensea.io/assets/ethereum/${BMAS_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={footerLink}>OpenSea</a>
          <span style={{ color: "#cfc8b8" }}>·</span>
          <a href={`https://etherscan.io/address/${BMAS_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={footerLink}>Etherscan</a>
        </div>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: "#b0aa9c", margin: 0 }}>
          IMMUTABLE · CODE IS LAW · TRUST IS ESSENTIAL · VERIFIED ON ETHERSCAN
        </p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#c9c2b3", marginTop: 8 }}>
          {BMAS_ADDRESS.toLowerCase()}
        </p>
      </footer>
    </div>
  );
}

function HowItem({ label, body }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 10, padding: "18px 20px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: "#1a1a1a", fontWeight: 600, marginBottom: 10 }}>{label.toUpperCase()}</div>
      <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 17, lineHeight: 1.5, color: "#3a3a3a", margin: 0 }}>{body}</p>
    </div>
  );
}

const sectionHeading = { fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 500, fontSize: 34, textAlign: "center", margin: "0 0 22px", letterSpacing: "-0.005em" };
const storyParagraph = { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 19, lineHeight: 1.55, color: "#2a2a2a", margin: "0 0 18px", textAlign: "left" };
const footerLink = { color: "#1a1a1a", textDecoration: "none", letterSpacing: "0.02em" };
const subSx = { fontSize: 10, color: "#999", marginLeft: 1, fontWeight: 400 };
const stepBtn = { width: 52, height: 52, border: "none", background: "transparent", fontSize: 26, color: "#666", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", borderRadius: 8 };
const navLink = { color: "#1a1a1a", textDecoration: "none", fontSize: 17, letterSpacing: "0.04em", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 500 };
