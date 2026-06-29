"use client";

import { useState, useCallback } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import Preloader from "./Preloader";
import SectionIndicator from "./SectionIndicator";
import ThemeToggle from "./ThemeToggle";
import HeroSection from "./sections/HeroSection";
import ReactionSection from "./sections/ReactionSection";
import ReactorIntelSection from "./sections/ReactorIntelSection";
import ApplicationsSection from "./sections/ApplicationsSection";
import TeamSection from "./sections/TeamSection";
import InvestorsSection from "./sections/InvestorsSection";

const SECTION_COUNT = 6;

export default function SiteShell() {
  const [loaded, setLoaded] = useState(false);
  const onPreloaderDone = useCallback(() => setLoaded(true), []);
  const { active, scrollTo } = useActiveSection(SECTION_COUNT);

  return (
    <>
      {/* Preloader */}
      {!loaded && <Preloader onComplete={onPreloaderDone} />}

      {/* Scroll container */}
      <div
        id="scroll-container"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <HeroSection />
        <ReactionSection />
        <ReactorIntelSection />
        <ApplicationsSection />
        <TeamSection />
        <InvestorsSection />
      </div>

      {/* Fixed section indicator — hidden on mobile */}
      <div className="hidden md:block">
        <SectionIndicator active={active} onChange={scrollTo} />
      </div>

      {/* Logo — independently fixed so it shares the same left column as hero content */}
      <div
        className="fixed z-50"
        style={{ left: "72px", top: "80px" }}
        aria-label="tera"
      >
        <span
          className="font-bold select-none"
          style={{
            background: "linear-gradient(90deg, #00B8CC 0%, #44C038 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "1.1rem",
            letterSpacing: "0.28em",
          }}
        >
          tera
        </span>
      </div>

      {/* Header — right-side controls only */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-start justify-end px-14 pt-10">
        <div className="flex items-center gap-5">
          <ThemeToggle />

          <button
            className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/5 active:scale-95"
            style={{
              color: "var(--text-primary)",
              border: "1.5px solid rgba(238,242,247,0.45)",
              letterSpacing: "0.08em",
            }}
            aria-label="Menu"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
              <rect x="0" y="0" width="6" height="6" rx="0.5" />
              <rect x="9" y="0" width="6" height="6" rx="0.5" />
              <rect x="0" y="9" width="6" height="6" rx="0.5" />
              <rect x="9" y="9" width="6" height="6" rx="0.5" />
            </svg>
            Menu
          </button>
        </div>
      </header>
    </>
  );
}
