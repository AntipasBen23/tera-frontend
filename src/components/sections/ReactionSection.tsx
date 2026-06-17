"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ReactorCanvas = dynamic(() => import("@/components/three/ReactorCanvas"), {
  ssr: false,
});

const STEPS = [
  {
    icon: "⬡",
    title: "Isolate the enzyme",
    body: "Extract and purify only the catalyst — the enzyme — that performs the desired chemical reaction.",
  },
  {
    icon: "⬡",
    title: "Remove the cell",
    body: "No living organism in the reactor. No growth phase, no contamination risk, no metabolic overhead.",
  },
  {
    icon: "⬡",
    title: "Run the reaction",
    body: "Substrate flows in, enzyme catalyses, product flows out. The process is clean, fast, and scalable.",
  },
];

export default function ReactionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cutaway, setCutaway] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const container = document.getElementById("scroll-container");
    if (!container) return;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.offsetTop;
      const scrollTop = container.scrollTop;
      const viewH = container.clientHeight;

      // How far into this section the user has scrolled (0 = section just entered, 1 = leaving)
      const progress = Math.max(0, Math.min(1, (scrollTop - sectionTop + viewH) / viewH));
      if (!mq.matches) setCutaway(Math.pow(progress, 1.5));
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (mq.matches || isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="reaction"
      ref={sectionRef}
      className="snap-section flex items-center"
      style={{ background: "var(--bg-section)" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Text column */}
        <div>
          <span className="text-label block mb-6">The Platform</span>
          <h2
            className="text-headline mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            The cell was never
            <br />
            the point.
          </h2>
          <p className="text-subhead mb-8">
            Traditional fermentation wraps enzyme production inside a living
            organism — with all its growth phases, contamination risk, and
            metabolic overhead. tera strips that away.
          </p>

          <div className="flex flex-col gap-5">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span
                  className="text-mono text-xs pt-0.5 shrink-0"
                  style={{ color: "var(--accent)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {step.title}
                  </p>
                  <p className="text-subhead text-sm">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D reactor column */}
        <div className="relative" style={{ height: "480px" }}>
          <ReactorCanvas
            cutawayProgress={cutaway}
            mouseX={mouse.x}
            mouseY={mouse.y}
          />

          {/* Floating labels */}
          <div
            className="absolute top-6 right-6 text-mono text-xs px-3 py-1.5 rounded-full glass pointer-events-none"
            style={{
              color: "var(--violet)",
              border: "1px solid var(--violet-dim)",
              opacity: 1 - cutaway,
            }}
          >
            ↓ Substrate
          </div>
          <div
            className="absolute bottom-6 right-6 text-mono text-xs px-3 py-1.5 rounded-full glass pointer-events-none"
            style={{
              color: "var(--accent)",
              border: "1px solid var(--border)",
              opacity: cutaway,
            }}
          >
            ↑ Product
          </div>
        </div>
      </div>
    </section>
  );
}
