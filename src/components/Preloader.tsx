"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: Props) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"counting" | "done" | "hidden">("counting");
  const rafId = useRef<number>(0);
  const startTime = useRef<number>(0);
  const DURATION = 1800; // ms

  useEffect(() => {
    // Respect reduced motion — skip counting, jump to 100
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setCount(100);
      setPhase("done");
      setTimeout(() => {
        setPhase("hidden");
        onComplete();
      }, 300);
      return;
    }

    startTime.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / DURATION, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * 100));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setCount(100);
        setPhase("done");
        // Short pause at 100, then fade out
        setTimeout(() => {
          setPhase("hidden");
          setTimeout(onComplete, 600);
        }, 400);
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [onComplete]);

  if (phase === "hidden") return null;

  return (
    <div
      id="preloader"
      className={phase === "done" ? "hidden" : ""}
      aria-hidden="true"
    >
      {/* Wordmark */}
      <div className="flex flex-col items-center gap-8">
        <span
          className="text-mono font-semibold tracking-[0.35em] text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          tera
        </span>

        {/* Progress bar */}
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            width: "160px",
            height: "1px",
            background: "var(--surface-alt)",
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-none"
            style={{
              width: `${count}%`,
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent-glow)",
              transition: "width 0.05s linear",
            }}
          />
        </div>

        {/* Counter */}
        <span
          className="text-mono"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {String(count).padStart(3, "0")}
        </span>
      </div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 50% 50%, var(--accent-glow) 0%, transparent 70%)",
          opacity: count / 200,
        }}
      />
    </div>
  );
}
