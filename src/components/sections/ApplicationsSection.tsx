"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const MoleculeCarouselCanvas = dynamic(
  () => import("@/components/three/MoleculeCarouselCanvas"),
  { ssr: false }
);

const INDUSTRIES = [
  {
    name: "Cosmetics",
    molecule: "Hyaluronic acid, retinol precursors",
    color: "#00DCB4",
    modelIdx: 0,
    detail:
      "Cell-free synthesis delivers cosmetic actives at purity levels that fermentation cannot reliably achieve.",
  },
  {
    name: "Fragrance",
    molecule: "Santalol, musks, ambergris analogues",
    color: "#C77DFF",
    modelIdx: 1,
    detail:
      "Endangered botanical molecules replicated enzymatically — no habitat extraction required.",
  },
  {
    name: "Food & Flavour",
    molecule: "Vanillin, steviol glycosides, rare sugars",
    color: "#F5C542",
    modelIdx: 2,
    detail:
      "Natural-identical flavour molecules produced without agricultural land use constraints.",
  },
  {
    name: "Pharmaceuticals",
    molecule: "Cannabinoids, alkaloids, antibiotics",
    color: "#F5C542",
    modelIdx: 2,
    detail:
      "Active pharmaceutical ingredients with traceable, reproducible synthesis at every batch.",
  },
  {
    name: "Critical Minerals",
    molecule: "Bioleaching enzymes for rare earth extraction",
    color: "#00DCB4",
    modelIdx: 0,
    detail:
      "Engineered enzyme consortia dissolve mineral matrices — cleaner than acid leaching.",
  },
];

const DWELL_TIME = 3500;

export default function ApplicationsSection() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance carousel
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setActiveIndustry((prev) => (prev + 1) % INDUSTRIES.length);
    }, DWELL_TIME);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeIndustry]);

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

  const active = INDUSTRIES[activeIndustry];

  return (
    <section
      id="applications"
      className="snap-section flex items-center overflow-hidden"
      style={{ background: "var(--bg-section)" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Molecule display */}
        <div className="relative" style={{ height: "420px" }}>
          <MoleculeCarouselCanvas
            activeIndex={active.modelIdx}
            mouseX={mouse.x}
            mouseY={mouse.y}
          />
          {/* Industry name overlay */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-mono text-xs px-4 py-2 rounded-full glass pointer-events-none"
            style={{ color: active.color, border: `1px solid ${active.color}44` }}
          >
            {active.molecule}
          </div>
        </div>

        {/* Industry list */}
        <div>
          <span className="text-label block mb-6">Applications</span>
          <h2
            className="text-headline mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            1% of nature's molecules
            <br />
            are in use.
            <br />
            <span style={{ color: "var(--accent)" }}>
              We're after the other 99.
            </span>
          </h2>
          <p className="text-subhead mb-8 max-w-md">
            AI-guided enzyme discovery unlocks bioactive molecules that have
            never reached industrial scale — across five industries already
            in development.
          </p>

          <div className="flex flex-col gap-2">
            {INDUSTRIES.map((ind, i) => {
              const isActive = i === activeIndustry;
              return (
                <button
                  key={ind.name}
                  onClick={() => {
                    if (timerRef.current) clearTimeout(timerRef.current);
                    setActiveIndustry(i);
                  }}
                  className="flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300"
                  style={{
                    background: isActive ? "var(--surface)" : "transparent",
                    border: isActive
                      ? `1px solid ${ind.color}55`
                      : "1px solid transparent",
                  }}
                >
                  <span
                    className="text-mono text-xs pt-0.5 shrink-0 transition-colors"
                    style={{ color: isActive ? ind.color : "var(--text-muted)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      className="text-sm font-semibold mb-0.5 transition-colors"
                      style={{
                        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {ind.name}
                    </p>
                    {isActive && (
                      <p
                        className="text-subhead text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {ind.detail}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
