"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EnzymeCanvas = dynamic(() => import("@/components/three/EnzymeCanvas"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Section {
  eyebrow: string;
  headline: [string, string];
  body: string;
  cta: string;
  ctaSecondary?: string;
}

const SECTIONS: Section[] = [
  {
    eyebrow: "Cell-Free Biomanufacturing",
    headline: ["Nature Works From", "First Principles"],
    body: "The natural world produces the richest and most remarkable chemistry on earth. tera harnesses AI-designed enzymes to unlock it — delivering higher purity, potency, and performance than ever before.",
    cta: "Explore Now",
    ctaSecondary: "Our Research",
  },
  {
    eyebrow: "The Platform",
    headline: ["AI-Designed", "Enzymes"],
    body: "We use artificial intelligence to design specific enzymes that react with powerful molecules from nature — unlocking ingredients with superior purity and potency for the next generation of products.",
    cta: "Discover the Platform",
  },
  {
    eyebrow: "Delivery Technology",
    headline: ["Nano-Enhanced", "Ingredients"],
    body: "Our nanotechnology modifies natural molecules to deliver higher stability, bioavailability, and performance — making nature's most potent compounds truly usable at scale.",
    cta: "See the Technology",
  },
  {
    eyebrow: "Applications",
    headline: ["Food. Cosmetics.", "Consumer Goods."],
    body: "From antioxidant-rich pomegranate and coffee extracts to next-generation cosmetic actives — tera creates novel ingredients that perform where nature alone cannot.",
    cta: "Explore Applications",
  },
  {
    eyebrow: "Our Team",
    headline: ["Scientists Who", "Think Different"],
    body: "Built at the intersection of biochemistry, AI and nanotechnology — tera's founders bring deep expertise in enzyme design and novel ingredient development.",
    cta: "Meet the Team",
  },
  {
    eyebrow: "Investors",
    headline: ["Partnering for a", "Biological Future"],
    body: "We are backed by those who believe nature's chemistry is the next great frontier. Join us in building a future where the world's most powerful molecules are accessible to all.",
    cta: "Get in Touch",
  },
];

interface Props {
  onScrollProgress?: (progress: number) => void;
}

export default function HeroSection({ onScrollProgress }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProg, setScrollProg] = useState(0);

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

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "heroTrigger",
        trigger: sectionRef.current,
        start: "top top",
        end: "+=500%",
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          onScrollProgress?.(self.progress);
          setScrollProg(self.progress);
          setActiveSection(Math.min(Math.floor(self.progress * 6), 5));
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [onScrollProgress]);

  const s = SECTIONS[activeSection];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* Grid lines — static base + moving highlights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-y-0 w-px" style={{ left: "17%", background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute inset-y-0 w-px" style={{ left: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute inset-y-0 w-px" style={{ left: "83%", background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute inset-x-0 h-px" style={{ top: "22%", background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute inset-x-0 h-px" style={{ top: "52%", background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute inset-x-0 h-px" style={{ top: "83%", background: "rgba(255,255,255,0.05)" }} />

        <div className="absolute w-px" style={{ top: 0, left: "17%", height: 180, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)", animation: "slideDown 6s linear infinite" }} />
        <div className="absolute w-px" style={{ top: 0, left: "50%", height: 180, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)", animation: "slideDown 8s linear infinite", animationDelay: "-3s" }} />
        <div className="absolute w-px" style={{ top: 0, left: "83%", height: 180, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)", animation: "slideDown 5s linear infinite", animationDelay: "-5s" }} />

        <div className="absolute h-px" style={{ left: 0, top: "22%", width: 150, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)", animation: "slideRight 7s linear infinite", animationDelay: "-1s" }} />
        <div className="absolute h-px" style={{ left: 0, top: "52%", width: 150, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)", animation: "slideRight 9s linear infinite", animationDelay: "-4s" }} />
        <div className="absolute h-px" style={{ left: 0, top: "83%", width: 150, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)", animation: "slideRight 6s linear infinite", animationDelay: "-2s" }} />
      </div>

      {/* Full-screen 3D model — fades out on team section */}
      <div
        className="absolute inset-0 z-10"
        style={{ opacity: activeSection === 4 ? 0 : 1, transition: "opacity 0.8s ease" }}
      >
        <EnzymeCanvas mouseX={mouse.x} mouseY={mouse.y} scrollProgress={scrollProg} />
      </div>

      {/* Team photo — fades in on section 5 in place of the model */}
      <div
        className="absolute inset-0 z-10 hidden md:flex items-center justify-end"
        style={{
          opacity: activeSection === 4 ? 1 : 0,
          transition: "opacity 0.8s ease",
          pointerEvents: "none",
        }}
      >
        <div style={{ marginRight: "80px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <img
            src="/images/team.jpg"
            alt="Amy Locks and Pedro Lovatt, tera co-founders"
            style={{
              maxWidth: "52vw",
              maxHeight: "68vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", gap: "40px" }}>
            <div>
              <p style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato), Lato, sans-serif", fontSize: "13px", fontWeight: 700 }}>Amy Locks</p>
              <p style={{ color: "var(--accent)", fontFamily: "var(--font-lato), Lato, sans-serif", fontSize: "11px", letterSpacing: "0.05em" }}>Co-founder & CEO</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "var(--text-primary)", fontFamily: "var(--font-lato), Lato, sans-serif", fontSize: "13px", fontWeight: 700 }}>Pedro Lovatt</p>
              <p style={{ color: "var(--accent)", fontFamily: "var(--font-lato), Lato, sans-serif", fontSize: "11px", letterSpacing: "0.05em" }}>Co-founder & CTO</p>
            </div>
          </div>
        </div>
      </div>

      {/* Left-to-right gradient — keeps text readable over full-bleed model */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, var(--bg) 20%, rgba(7,9,8,0.88) 38%, rgba(7,9,8,0.35) 56%, transparent 76%)",
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 30%)" }}
      />

      {/* Content — key forces re-mount, CSS contentFadeIn fires on each section change */}
      <div
        key={activeSection}
        className="absolute z-30 max-w-[500px]"
        style={{ left: "72px", bottom: "130px", animation: "contentFadeIn 0.45s ease forwards" }}
      >
        <p
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-lato), Lato, sans-serif",
            fontSize: "18px",
            fontWeight: 400,
            marginBottom: "8px",
          }}
        >
          {s.eyebrow}
        </p>

        <h1
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-lato), Lato, sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1.15,
            margin: "6px 0 0",
          }}
        >
          {s.headline[0]}
          <br />
          <span
            className="glow"
            style={{
              background: "linear-gradient(90deg, #00A8BB, #38A832)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {s.headline[1]}
          </span>
        </h1>

        <p
          style={{
            maxWidth: "480px",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-lato), Lato, sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.6,
            marginTop: "28px",
            marginBottom: "40px",
          }}
        >
          {s.body}
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            className="relative flex items-center gap-3 overflow-hidden group active:scale-95"
            style={{
              background: "#FFFFFF",
              padding: "14px 20px",
              fontFamily: "var(--font-lato), Lato, sans-serif",
            }}
          >
            <div className="absolute inset-0 bg-[#070908] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-3 text-sm font-semibold text-[#070908] group-hover:text-white transition-colors duration-300">
              {s.cta}
              <ArrowIcon />
            </span>
          </button>

          {s.ctaSecondary && (
            <button
              className="relative flex items-center gap-3 overflow-hidden group active:scale-95"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(238,242,247,0.45)",
                padding: "14px 20px",
                fontFamily: "var(--font-lato), Lato, sans-serif",
              }}
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-3 text-sm font-semibold text-white group-hover:text-[#070908] transition-colors duration-300">
                {s.ctaSecondary}
                <ArrowIcon />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Scroll hint — only on first section */}
      {activeSection === 0 && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <div
            className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
            style={{ borderColor: "rgba(238,242,247,0.2)" }}
          >
            <div className="w-px h-2 animate-bounce rounded-full" style={{ background: "var(--accent)" }} />
          </div>
          <span className="text-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.2em" }}>
            SCROLL
          </span>
        </div>
      )}
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
