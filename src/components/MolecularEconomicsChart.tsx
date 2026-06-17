"use client";

import { useState, useRef, useCallback } from "react";

// Sample data points: [time_to_purity_hours, cost_per_gram_usd, label, istera]
const PROCESSES = [
  { label: "Fermentation (standard)", time: 96, cost: 8.5, istera: false },
  { label: "Fermentation (optimised)", time: 72, cost: 6.2, istera: false },
  { label: "Chemical synthesis", time: 48, cost: 12.0, istera: false },
  { label: "Extraction (botanical)", time: 120, cost: 18.0, istera: false },
  { label: "tera baseline", time: 28, cost: 4.8, istera: true },
  { label: "tera + RIP (projected)", time: 18, cost: 3.1, istera: true },
];

const CHART_W = 500;
const CHART_H = 280;
const PADDING = { top: 20, right: 20, bottom: 48, left: 52 };

const MAX_TIME = 140;
const MAX_COST = 22;

function toX(time: number) {
  return PADDING.left + ((time / MAX_TIME) * (CHART_W - PADDING.left - PADDING.right));
}
function toY(cost: number) {
  return PADDING.top + ((1 - cost / MAX_COST) * (CHART_H - PADDING.top - PADDING.bottom));
}

interface TooltipState {
  x: number;
  y: number;
  label: string;
  time: number;
  cost: number;
  istera: boolean;
}

export default function MolecularEconomicsChart() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const gridLines = {
    x: [0, 30, 60, 90, 120],
    y: [0, 5, 10, 15, 20],
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="text-label mb-3" style={{ color: "var(--text-muted)" }}>
        Cost per gram (USD) vs. Time to purity (hours)
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full"
        style={{ maxWidth: CHART_W, fontFamily: "var(--font-mono)" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {gridLines.x.map((t) => (
          <line
            key={`gx-${t}`}
            x1={toX(t)}
            y1={PADDING.top}
            x2={toX(t)}
            y2={CHART_H - PADDING.bottom}
            stroke="var(--border)"
            strokeWidth={0.5}
            strokeDasharray="3 4"
          />
        ))}
        {gridLines.y.map((c) => (
          <line
            key={`gy-${c}`}
            x1={PADDING.left}
            y1={toY(c)}
            x2={CHART_W - PADDING.right}
            y2={toY(c)}
            stroke="var(--border)"
            strokeWidth={0.5}
            strokeDasharray="3 4"
          />
        ))}

        {/* Axis labels */}
        {gridLines.x.map((t) => (
          <text
            key={`lx-${t}`}
            x={toX(t)}
            y={CHART_H - PADDING.bottom + 16}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={9}
          >
            {t}h
          </text>
        ))}
        {gridLines.y.map((c) => (
          <text
            key={`ly-${c}`}
            x={PADDING.left - 8}
            y={toY(c) + 3}
            textAnchor="end"
            fill="var(--text-muted)"
            fontSize={9}
          >
            ${c}
          </text>
        ))}

        {/* Axis titles */}
        <text
          x={CHART_W / 2}
          y={CHART_H - 4}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize={9}
          letterSpacing={1}
        >
          TIME TO PURITY
        </text>
        <text
          x={10}
          y={CHART_H / 2}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize={9}
          letterSpacing={1}
          transform={`rotate(-90, 10, ${CHART_H / 2})`}
        >
          COST / GRAM
        </text>

        {/* "Better" zone arrow annotation */}
        <text
          x={toX(15)}
          y={toY(2)}
          fill="var(--accent)"
          fontSize={9}
          opacity={0.5}
        >
          ← better →
        </text>

        {/* Data points */}
        {PROCESSES.map((p, i) => {
          const cx = toX(p.time);
          const cy = toY(p.cost);
          const color = p.istera ? "var(--accent)" : "var(--text-muted)";
          const r = p.istera ? 7 : 5;
          return (
            <g
              key={i}
              onMouseEnter={() =>
                setTooltip({ x: cx, y: cy, label: p.label, time: p.time, cost: p.cost, istera: p.istera })
              }
              style={{ cursor: "pointer" }}
            >
              {p.istera && (
                <circle cx={cx} cy={cy} r={14} fill="var(--accent)" opacity={0.1} />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={color}
                opacity={0.9}
                style={{ filter: p.istera ? "drop-shadow(0 0 6px var(--accent-glow))" : "none" }}
              />
              {p.istera && (
                <text
                  x={cx + 10}
                  y={cy - 8}
                  fill="var(--accent)"
                  fontSize={8}
                  fontWeight="600"
                >
                  {p.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={Math.min(tooltip.x + 12, CHART_W - 160)}
              y={Math.max(tooltip.y - 36, PADDING.top)}
              width={150}
              height={52}
              rx={6}
              fill="var(--surface)"
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={Math.min(tooltip.x + 20, CHART_W - 152)}
              y={Math.max(tooltip.y - 20, PADDING.top + 14)}
              fill={tooltip.istera ? "var(--accent)" : "var(--text-primary)"}
              fontSize={9}
              fontWeight="600"
            >
              {tooltip.label}
            </text>
            <text
              x={Math.min(tooltip.x + 20, CHART_W - 152)}
              y={Math.max(tooltip.y - 7, PADDING.top + 27)}
              fill="var(--text-secondary)"
              fontSize={8}
            >
              {tooltip.time}h · ${tooltip.cost}/g
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent-glow)" }}
          />
          <span className="text-mono text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
            tera
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--text-muted)" }}
          />
          <span className="text-mono text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
            Industry comparators
          </span>
        </div>
      </div>
    </div>
  );
}
