"use client";

import { useEffect, useRef } from "react";

const SECTIONS = [
  { id: "hero", label: "From First Principles" },
  { id: "reaction", label: "The Reaction" },
  { id: "reactor-intel", label: "Reactor Intelligence" },
  { id: "applications", label: "Applications" },
  { id: "team", label: "Team" },
  { id: "investors", label: "Investors" },
];

interface Props {
  active: number;
  onChange: (index: number) => void;
}

export default function SectionIndicator({ active, onChange }: Props) {
  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-4"
    >
      {SECTIONS.map((section, i) => {
        const isActive = i === active;
        return (
          <button
            key={section.id}
            onClick={() => onChange(i)}
            aria-label={`Go to section: ${section.label}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3 focus:outline-none"
          >
            {/* Label — visible on hover */}
            <span
              className="text-label translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
              style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
            >
              {section.label}
            </span>

            {/* Number + pip */}
            <span className="flex flex-col items-center gap-1">
              <span
                className="text-mono text-[0.65rem] transition-colors duration-300"
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="block transition-all duration-300"
                style={{
                  width: isActive ? "1.5px" : "1px",
                  height: isActive ? "1.75rem" : "1rem",
                  background: isActive ? "var(--accent)" : "var(--text-muted)",
                  borderRadius: "1px",
                  boxShadow: isActive ? "0 0 8px var(--accent-glow)" : "none",
                }}
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
}
