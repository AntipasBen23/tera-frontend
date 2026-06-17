"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Sync initial value from html attribute
    const current = document.documentElement.getAttribute("data-theme") as Theme;
    if (current) setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex items-center gap-2 focus:outline-none transition-opacity hover:opacity-70"
    >
      {/* Sun / Moon icon */}
      <span
        className="relative flex items-center justify-center w-8 h-8 rounded-full glass"
        style={{ border: "1px solid var(--border)" }}
      >
        {theme === "dark" ? (
          /* Moon */
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1a6 6 0 0 0 5.5 8.5A6 6 0 1 1 7 1z"
              fill="var(--text-secondary)"
            />
          </svg>
        ) : (
          /* Sun */
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="2.5" fill="var(--text-secondary)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1={7 + Math.cos((deg * Math.PI) / 180) * 3.5}
                y1={7 + Math.sin((deg * Math.PI) / 180) * 3.5}
                x2={7 + Math.cos((deg * Math.PI) / 180) * 4.5}
                y2={7 + Math.sin((deg * Math.PI) / 180) * 4.5}
                stroke="var(--text-secondary)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
          </svg>
        )}
      </span>
    </button>
  );
}
