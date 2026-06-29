"use client";

const SECTION_COUNT = 6;

interface Props {
  active: number;
  onChange: (index: number) => void;
}

export default function SectionIndicator({ active, onChange }: Props) {
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
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={`Go to section ${i + 1}`}
            className="flex flex-col items-center focus:outline-none group"
          >
            {/* Connector line (above each dot except the first) */}
            {i > 0 && (
              <div
                style={{
                  width: "1.5px",
                  height: "22px",
                  background: i <= active ? "var(--accent)" : "rgba(255,255,255,0.15)",
                  transition: "background 0.4s ease",
                }}
              />
            )}

            {/* Dot */}
            <div
              style={{
                width:  i === active ? "10px" : "6px",
                height: i === active ? "10px" : "6px",
                borderRadius: "50%",
                background: i === active ? "var(--accent)" : "rgba(255,255,255,0.25)",
                boxShadow: i === active ? "0 0 8px var(--accent-glow)" : "none",
                transition: "all 0.4s ease",
              }}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
