"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const EnzymeCanvas = dynamic(() => import("@/components/three/EnzymeCanvas"), {
  ssr: false,
});

export default function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

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

  const scrollToNext = () => {
    const container = document.getElementById("scroll-container");
    if (container) container.scrollTop = container.clientHeight;
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="snap-section relative flex items-center justify-center overflow-hidden"
    >
      {/* 3D enzyme — full-bleed behind content */}
      <div className="absolute inset-0 z-0">
        <EnzymeCanvas mouseX={mouse.x} mouseY={mouse.y} />
      </div>

      {/* Radial vignette so text stays readable */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, transparent 20%, var(--bg) 90%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-3xl px-8 text-center">
        <span className="text-label block mb-6">Cell-Free Biomanufacturing</span>

        <h1
          className="text-display mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          From First
          <br />
          <span style={{ color: "var(--accent)" }} className="glow">
            Principles.
          </span>
        </h1>

        <p className="text-subhead max-w-xl mx-auto mb-10">
          tera re-imagines how powerful molecules from nature are made —
          building directly from the chemistry up, without the cell.
        </p>

        <button
          onClick={scrollToNext}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
            boxShadow: "0 0 24px var(--accent-glow)",
          }}
        >
          Explore the Platform
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="animate-bounce"
          >
            <path
              d="M7 1v12M1 7l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ color: "var(--text-muted)" }}
      >
        <div
          className="w-px animate-pulse"
          style={{
            height: "3rem",
            background:
              "linear-gradient(to bottom, var(--accent), transparent)",
          }}
        />
        <span className="text-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
          SCROLL
        </span>
      </div>
    </section>
  );
}
