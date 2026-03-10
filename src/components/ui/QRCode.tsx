"use client";

import { useMemo } from "react";
import qrcodegen from "@/lib/qrcodegen";

const QrCode = qrcodegen.QrCode;

interface StyledQRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

function isFinderModule(x: number, y: number, qrSize: number): boolean {
  if (x <= 6 && y <= 6) return true;
  if (x >= qrSize - 7 && y <= 6) return true;
  if (x <= 6 && y >= qrSize - 7) return true;
  return false;
}

export default function StyledQRCode({ value, size = 200, className = "" }: StyledQRCodeProps) {
  const { dataCircles, finderPositions, cellSize } = useMemo(() => {
    const qr = QrCode.encodeText(value, QrCode.Ecc.MEDIUM);
    const mod = qr.size;
    const mar = 3;
    const total = mod + mar * 2;
    const cell = size / total;

    const circles: { cx: number; cy: number; r: number; accent: boolean }[] = [];
    for (let y = 0; y < mod; y++) {
      for (let x = 0; x < mod; x++) {
        if (!qr.getModule(x, y)) continue;
        if (isFinderModule(x, y, mod)) continue;

        const cx = (x + mar) * cell + cell / 2;
        const cy = (y + mar) * cell + cell / 2;
        const isEven = (x + y) % 2 === 0;
        const r = cell * (isEven ? 0.38 : 0.32);
        circles.push({ cx, cy, r, accent: false });
      }
    }

    const finders = [
      { x: mar * cell, y: mar * cell },
      { x: (mar + mod - 7) * cell, y: mar * cell },
      { x: mar * cell, y: (mar + mod - 7) * cell },
    ];

    return { dataCircles: circles, finderPositions: finders, cellSize: cell };
  }, [value, size]);

  const finderSize = 7 * cellSize;
  const finderInner = 3 * cellSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Transparent background */}
      <rect width={size} height={size} fill="transparent" />

      {/* Finder patterns — rounded with orange centers */}
      {finderPositions.map((pos, i) => (
        <g key={`f-${i}`}>
          <rect
            x={pos.x}
            y={pos.y}
            width={finderSize}
            height={finderSize}
            rx={finderSize * 0.22}
            fill="none"
            stroke="white"
            strokeWidth={cellSize * 0.85}
          />
          <rect
            x={pos.x + 2 * cellSize}
            y={pos.y + 2 * cellSize}
            width={finderInner}
            height={finderInner}
            rx={finderInner * 0.28}
            fill="var(--color-primary)"
          />
        </g>
      ))}

      {/* Data dots — white and orange alternating */}
      {dataCircles.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill={d.accent ? "var(--color-primary)" : "white"}
        />
      ))}
    </svg>
  );
}
