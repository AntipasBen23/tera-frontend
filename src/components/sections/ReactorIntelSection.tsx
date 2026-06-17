"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SENSOR_POINTS } from "@/components/three/DigitalTwinModel";

const DigitalTwinCanvas = dynamic(
  () => import("@/components/three/DigitalTwinCanvas"),
  { ssr: false }
);

const METRICS = [
  { value: "20–40%", label: "more batches annually" },
  { value: "15–30%", label: "higher yields" },
  { value: "Real-time", label: "anomaly detection" },
];

const CAPABILITIES = [
  "Live sensor fusion across 8 data streams",
  "Enzyme deactivation forecasting",
  "Automated anomaly detection & alert",
  "Digital twin running alongside every batch",
];

export default function ReactorIntelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [twinProg, setTwinProg] = useState(0);
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
      const progress = Math.max(0, Math.min(1, (scrollTop - sectionTop + viewH) / viewH));
      if (!mq.matches) setTwinProg(Math.pow(progress, 1.2));
      else setTwinProg(1);
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
      id="reactor-intel"
      ref={sectionRef}
      className="snap-section flex items-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left — 3D digital twin */}
        <div className="relative order-2 lg:order-1" style={{ height: "480px" }}>
          <DigitalTwinCanvas
            twinProgress={twinProg}
            mouseX={mouse.x}
            mouseY={mouse.y}
          />

          {/* Floating sensor legend */}
          <div
            className="absolute bottom-4 left-0 flex flex-wrap gap-2 pointer-events-none"
            style={{ opacity: twinProg }}
          >
            {SENSOR_POINTS.slice(0, 4).map((s) => (
              <span
                key={s.label}
                className="text-mono text-[0.6rem] px-2 py-1 rounded-full"
                style={{
                  color: s.color,
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}44`,
                }}
              >
                ● {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right — text */}
        <div className="order-1 lg:order-2">
          <span className="text-label block mb-6">Reactor Intelligence Platform</span>
          <h2
            className="text-headline mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            The batch knows
            <br />
            what it needs.
            <br />
            <span style={{ color: "var(--accent)" }}>We make it tell you.</span>
          </h2>

          <p className="text-subhead mb-8">
            A digital twin runs alongside every production run — monitoring eight
            live data streams, forecasting enzyme deactivation before it happens,
            and surfacing exactly what to adjust and when.
          </p>

          {/* Capabilities list */}
          <ul className="flex flex-col gap-3 mb-10">
            {CAPABILITIES.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent-glow)" }}
                />
                <span className="text-subhead text-sm">{c}</span>
              </li>
            ))}
          </ul>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {METRICS.map((m) => (
              <div key={m.label} className="glass rounded-xl p-4">
                <div
                  className="font-semibold mb-1 glow"
                  style={{ color: "var(--accent)", fontSize: "1.25rem" }}
                >
                  {m.value}
                </div>
                <div
                  className="text-mono"
                  style={{ color: "var(--text-muted)", fontSize: "0.65rem", lineHeight: 1.4 }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
