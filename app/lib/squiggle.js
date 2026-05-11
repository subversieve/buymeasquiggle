"use client";

// Mirrors the on-chain SquiggleRenderer.sol (Catmull-Rom slices, rainbow HSL).
// ys: array of uint8-like values (0-255) for control point Y positions.
// points: number of slices to render (1-15).
// startHue: 0-360 base hue.
// reverse: boolean, if true hue cycles backward.
// bgGray: 0-255 grayscale background value.
// phaseShift: optional extra hue offset (for animation).

import { useMemo } from "react";

const W        = 480;
const H        = 360;
const MID_Y    = 180;
const LEFT_PAD = 36;
const USABLE_W = 408;
const GAP      = 7;
const AMP      = 110;

export function BMASSquiggle({ points = 15, ys, startHue = 0, reverse = false, bgGray = 20, phaseShift = 0, width = "100%", height = "100%" }) {
  const numSlices = Math.min(Math.max(1, points), 15);
  const numCtrl   = numSlices + 1;
  const stepW     = USABLE_W / numSlices;

  const ctrlYs = useMemo(() => {
    return Array.from({ length: numCtrl }, (_, i) => {
      const b = ys[i] ?? 128;
      return MID_Y + ((b - 128) * AMP) / 128;
    });
  }, [ys, numCtrl]);

  const paths = useMemo(() => {
    const result = [];
    for (let j = 0; j < numSlices; j++) {
      const yPrev = j > 0         ? ctrlYs[j - 1] : ctrlYs[0];
      const y0    = ctrlYs[j];
      const y1    = ctrlYs[j + 1];
      const yNext = j + 2 < numCtrl ? ctrlYs[j + 2] : ctrlYs[numCtrl - 1];

      const cp1y = y0 + (y1 - yPrev) / 6;
      const cp2y = y1 - (yNext - y0) / 6;

      const xS   = LEFT_PAD + j * stepW + (j === 0             ? 0 : GAP);
      const xE   = LEFT_PAD + (j + 1) * stepW - (j === numSlices - 1 ? 0 : GAP);
      const cp1x = xS + (xE - xS) / 3;
      const cp2x = xS + 2 * (xE - xS) / 3;

      const rawHue = reverse
        ? (startHue + 360 - (j * 360) / numSlices) % 360
        : (startHue + (j * 360) / numSlices) % 360;
      const hue = (rawHue + phaseShift) % 360;

      const d = `M ${xS.toFixed(1)},${y0.toFixed(1)} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${xE.toFixed(1)},${y1.toFixed(1)}`;
      result.push(
        <path key={j} d={d} stroke={`hsl(${hue},92%,58%)`} strokeWidth="13" fill="none" strokeLinecap="round" />
      );
    }
    return result;
  }, [ctrlYs, numSlices, numCtrl, stepW, startHue, reverse, phaseShift]);

  const bg = `rgb(${bgGray},${bgGray},${bgGray})`;

  return (
    <svg viewBox="0 0 480 360" width={width} height={height} style={{ display: "block" }}>
      <rect width="100%" height="100%" fill={bg} />
      {paths}
    </svg>
  );
}

// Fixed control point arrays for deterministic previews
export const YS_ORGANIC = [210, 70, 170, 40, 230, 60, 190, 100, 240, 30, 180, 120, 200, 50, 220, 80];
export const YS_WAVE    = [200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50];
export const YS_CHILL   = [160, 100, 220, 80, 200, 60, 210, 90, 190, 110, 215, 70, 205, 85, 195, 95];
