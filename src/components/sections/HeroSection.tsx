"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const EnzymeCanvas = dynamic(() => import("@/components/three/EnzymeCanvas"), {
  ssr: false,
});

export default function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (mq.matches || isTouch) return;

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
    const c = document.getElementById("scroll-container");
    if (c) c.scrollTop = c.clientHeight;
  };

  return (
    <section id="hero" className="snap-section relative overflow-hidden">

      {/* Subtle grid — beyond-aero signature */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "140px 140px",
        }}
      />

      {/* 3D model — right 62% of viewport */}
      <div className="absolute top-0 right-0 w-full md:w-[62%] h-full z-10">
        <EnzymeCanvas mouseX={mouse.x} mouseY={mouse.y} />
      </div>

      {/* Left-fade — bleeds text area cleanly into the 3D scene */}
      <div
        className="absolute inset-0 z-20 pointer-events-none hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, var(--bg) 28%, rgba(7,9,8,0.75) 52%, transparent 72%)",
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--bg) 0%, transparent 25%)",
        }}
      />

      {/* ── TEXT — same left column as the logo (120px) ── */}
      <div className="absolute z-30 max-w-[500px]" style={{ left: "72px", bottom: "130px" }}>

        {/* Eyebrow — 18px Lato matching reference, accent color preserved */}
        <p
          className="mb-5"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-lato), Lato, sans-serif",
            fontSize: "18px",
            fontWeight: 400,
          }}
        >
          Cell-Free Biomanufacturing
        </p>

        {/* Headline — 32px Lato matching reference, colors preserved */}
        <h1
          className="mb-5"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-lato), Lato, sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1.15,
            margin: "6px 0px 0px",
          }}
        >
          Nature Works From
          <br />
          <span
            className="glow"
            style={{
              background: "linear-gradient(90deg, #00B8CC, #44C038)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            First Principles
          </span>
        </h1>

        {/* Body */}
        <p
          className="mb-10"
          style={{
            maxWidth: "400px",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-lato), Lato, sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.6,
            marginTop: "28px",
          }}
        >
          tera re-imagines how powerful molecules from nature are made.
          Building directly from the chemistry up, without the cell.
        </p>

        {/* CTAs — beyond-aero style: solid + outlined */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={scrollToNext}
            className="flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg)",
            }}
          >
            Explore the Platform
            <ArrowIcon />
          </button>

          <button
            className="flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{
              background: "transparent",
              color: "var(--text-primary)",
              border: "1px solid rgba(238,242,247,0.25)",
            }}
          >
            Our Research
            <ArrowIcon />
          </button>
        </div>
      </div>

      {/* Section number — bottom-right, beyond-aero style */}
      <div
        className="absolute bottom-8 right-10 z-30 flex items-center gap-3"
        style={{ color: "var(--text-muted)" }}
      >
        <span
          className="text-mono font-medium"
          style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}
        >
          01
        </span>
        <div
          className="h-px w-8"
          style={{ background: "var(--text-muted)", opacity: 0.5 }}
        />
      </div>

      {/* Scroll indicator — center bottom */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        style={{ color: "var(--text-muted)" }}
      >
        {/* Mouse icon */}
        <div
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: "rgba(238,242,247,0.2)" }}
        >
          <div
            className="w-px h-2 animate-bounce rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </div>
        <span
          className="text-mono"
          style={{ fontSize: "0.5rem", letterSpacing: "0.2em" }}
        >
          SCROLL
        </span>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.5 8h5M8.5 5.5L11 8l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
