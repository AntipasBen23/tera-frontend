"use client";

const SECTION_COUNT = 6;
const CONNECTOR_H = 25;

interface Props {
  active: number;
  scrollProgress: number; // 0–1 across all sections
  onChange: (index: number) => void;
}

export default function SectionIndicator({ active, scrollProgress, onChange }: Props) {
  return (
    <nav
      aria-label="Section navigation"
      className="fixed bottom-14 right-24 z-50 hidden md:flex items-end gap-3"
    >
      {/* Current section number */}
      <span
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          marginBottom: "2px",
        }}
      >
        {String(active + 1).padStart(2, "0")}
      </span>

      {/* Compact vertical track */}
      <div className="flex flex-col items-center">
        {Array.from({ length: SECTION_COUNT }).map((_, i) => {
          // For connector above dot i (connecting dot i-1 → dot i):
          // fill goes 0→1 as scrollProgress passes through segment [i-1, i] out of 6
          const segFill = i > 0
            ? Math.max(0, Math.min(1, scrollProgress * 6 - (i - 1)))
            : 0;

          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              aria-label={`Go to section ${i + 1}`}
              className="flex flex-col items-center focus:outline-none group"
            >
              {/* Connector line — split into background + fill overlay */}
              {i > 0 && (
                <div
                  style={{
                    width: "1.5px",
                    height: `${CONNECTOR_H}px`,
                    position: "relative",
                    background: "rgba(255,255,255,0.15)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${segFill * CONNECTOR_H}px`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
              )}

              {/* Dot */}
              <div
                style={{
                  width:  i === active ? "11px" : "7px",
                  height: i === active ? "11px" : "7px",
                  borderRadius: "50%",
                  background: i === active ? "var(--accent)" : "rgba(255,255,255,0.25)",
                  boxShadow: i === active ? "0 0 8px var(--accent-glow)" : "none",
                  transition: "all 0.4s ease",
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
